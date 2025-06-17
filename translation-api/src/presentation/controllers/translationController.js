function generateHateos(baseUrl, translationId){
    return{
        self:{
            href:`${baseUrl}/translations/${translationId}`,
            method:'GET'
        }
    };
}

export class TranslationController{
    constructor(createTranslationUseCase, getTranslationStatusUseCase){
        this.createTranslationUseCase = createTranslationUseCase;
        this.getTranslationStatusUseCase = getTranslationStatusUseCase;
    }

    async create(req, res){
        try{
            const { text, targetLanguage } = req.body;
            const translation = await this.createTranslationUseCase.execute({ text, targetLanguage});
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const links = generateHateos(baseUrl, translation.translation.id);

            return res.status(202).json({
                message: 'Solicitação de tradução recebida',
                requestId: translation.id,
                _links: links
            });        
    } catch (error){
        return res.status(500).json({
            message: 'Erro interno no servidor', error: error.message
        });
    }
}

    async getStatus(req, res){
        try{
            const {id} = req.params;
            const translation = await this.getTranslationStatusUseCase.execute({ id });
            if(!translation) 
                return res.status(404).json({
                    message: 'Tradução não encontrada.'
                });
            
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const { originalText, ...response } = translation;
            response._links = generateHateos(baseUrl, translation.id);

            return res.status(200).json(response)
        } catch (error){
            return res.status(500).json({
                message: 'Erro interno no servidor', error:error.message});
        }
    }
}
