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

        existingTranslation.status = status;
        existingTranslation.translatedText = translatedText;
        existingTranslation.error = error;

        await this.translationRepository.update(existingTranslation);
        console.log(`[💾] API: Status de ${requestId} atualizado para "${status}".`);
    }
}