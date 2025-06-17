import { v4 as uuidv4 } from 'uuid';

export class Translation {
    /**
 * @swagger
 * components:
 * schemas:
 * Translation:
 * type: object
 * properties:
 * id:
 * type: string
 * format: uuid
 * description: O ID único da solicitação de tradução.
 * originalText:
 * type: string
 * description: O texto original enviado para tradução.
 * targetLanguage:
 * type: string
 * description: O idioma de destino para a tradução.
 * status:
 * type: string
 * enum: [queued, processing, completed, failed]
 * description: O status atual da tradução.
 * translatedText:
 * type: string
 * nullable: true
 * description: O texto traduzido (disponível quando o status é 'completed').
 * error:
 * type: string
 * nullable: true
 * description: Mensagem de erro (disponível quando o status é 'failed').
 * createdAt:
 * type: string
 * format: date-time
 * description: A data e hora de criação da solicitação.
 * updatedAt:
 * type: string
 * format: date-time
 * description: A data e hora da última atualização.
 * example:
 * id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 * status: "completed"
 * createdAt: "2025-06-17T22:50:15.123Z"
 * updatedAt: "2025-06-17T22:50:18.456Z"
 */
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
        this.updateAt = updateAt || new Date();
    }
}