export class TranslationRepository{
    async save(translation){
        throw new Error("O método 'save()' deve ser implementado.")
    }
    async findById(id){
        throw new Error("O método 'findById()' deve ser implementado.")
    }
    async update(translation) {
        throw new Error("O método 'update()' deve ser implementado.")
        
    }
}