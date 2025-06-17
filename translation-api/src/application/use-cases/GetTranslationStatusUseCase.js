export class GetTranslationStatusUseCase{
    constructor(translationRepository){
        this.translationRepository = translationRepository;
    }
    async execute({id}){
        return this.translationRepository.findById(id);
    }
}