import { v4 as uuidv4 } from 'uuid';

export class Translation {
    constructor({
        id,
        originalText,
        targetLanguage,
        status = 'queued',
        translatedText = null,
        error = null,
        createdAt,
        updateAt
    }){
        this.id = uuidv4();
        this.originalText = originalText;
        this.targetLanguage = targetLanguage;
        this.status = status;
        this.translatedText = translatedText;
        this.error = error;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updateAt || new Date();
    }
}