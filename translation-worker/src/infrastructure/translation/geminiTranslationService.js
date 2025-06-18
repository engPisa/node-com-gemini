import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranslationService } from '../../application/services/translationService.js';

export class GeminiTranslationService extends TranslationService{
    constructor(apiKey){
        super();
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash"
        });
    }

    async translate(text, targetLanguage){
        const prompt = `Traduza o seguinte texto para ${targetLanguage}. Retorne apenas o texto traduzido, sem frases introdutórias ou explicações: "${text}"`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    }
}