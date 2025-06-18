export class ProcessTranslationResultUseCase{
    constructor(translationRepository){
        this.translationRepository = translationRepository;
    }

    async execute({requestId, status, translatedText, error}){
        const existingTranslation = await this.translationRepository.findById(requestId);
        if (!existingTranslation){
            console.warn(`[⚠️] Resultado para tradução não encontrada: ${requestId}`);
            return;
        }

        if (status === 'processing' && existingTranslation.status !== 'queued') {
            console.log(`[➡️] API: Ignorando atualização para 'processing' para o ID ${requestId}, pois o status atual já é '${existingTranslation.status}'.`);
            return; 
        }

        if (existingTranslation.status === 'completed' || existingTranslation.status === 'failed') {
            console.log(`[➡️] API: Ignorando atualização para '${status}' para o ID ${requestId}, pois já está no estado final '${existingTranslation.status}'.`);
            return; 
        }
        
        const dataToUpdate = {
            status: status,
            translatedText: translatedText,
            error: error
        };

        await this.translationRepository.update({ id: requestId, data: dataToUpdate });
        console.log(`[💾] API: Status de ${requestId} atualizado para "${status}".`);
    }
}