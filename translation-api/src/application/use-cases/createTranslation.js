import { Translation } from '../../domain/translation.js';

export class CreateTranslationUseCase{
    constructor(translationRepository, queueService){
        this.translationRepository = translationRepository;
        this.queueService = queueService;
    }

    async execute({text, targetLanguage}){
        const translation = new Translation({
            originalText: text,
            targetLanguage
        })

        await this.translationRepository.save(translation);
        await this.queueService.publish('q.translation.requests',{
            requestId: translation.id,
            text: translation.originalText,
            targetLanguage: translation.targetLanguage
        });
        return translation;
    }
}

