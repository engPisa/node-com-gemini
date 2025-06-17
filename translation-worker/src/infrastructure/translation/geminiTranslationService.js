import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranslationService } from '../../application/services/translationService';

export class GeminiTranslationService extends TranslationService{
    constructor(apiKey){
        super();
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });
    }

    async translate(text, targetLanguage){
        const promp = `Traduza o seguinte texto para ${targetLanguage}. Retorne apenas o texto traduzido, sem frases introdutórias ou explicações: "${text}"`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    }
}