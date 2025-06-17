export class ProcessTranslationRequestUseCase {
    constructor(queueService, translationService) {
        this.queueService = queueService;
        this.translationService = translationService;
    }

    async execute({ requestId, text, targetLanguage }) {
        const resultQueue = 'q.translation.result';
        try {
            console.log(`[🚀] WORKER: Iniciando processamento para ${requestId}.`);

            await this.queueService.publish(resultQueue, {
                requestId,
                status: 'processing'
            });

            const translatedText = await this.translationService.translate(text, targetLanguage);

            await this.queueService.publish(resultQueue, {
                requestId,
                status: 'completed',
                translatedText,
            });

        } catch (error) {
            console.error(`❌ WORKER: Erro na tradução de ${requestId}:`, error);
            await this.queueService.publish(resultQueue, {
                requestId,
                status: 'failed',
                error: error.message,
            });
        }
    }
}
