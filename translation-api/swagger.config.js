export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Translation API',
      version: '1.0.0',
      description: 'API para solicitar traduções de texto de forma assíncrona utilizando o Gemini.',
      contact: {
        name: 'Engenharia de Software - Biopark',
        url: 'https://bioparkeducacao.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      schemas: {
        Translation: {
          type: 'object',
          required: ['originalText', 'targetLanguage'],  // Marque os campos obrigatórios aqui
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'O ID único da solicitação de tradução.',
            },
            originalText: {
              type: 'string',
              description: 'O texto original enviado para tradução.',
            },
            targetLanguage: {
              type: 'string',
              description: 'O idioma de destino para a tradução.',
            },
            status: {
              type: 'string',
              enum: ['queued', 'processing', 'completed', 'failed'],
              description: 'O status atual da tradução.',
            },
            translatedText: {
              type: 'string',
              nullable: true,
              description: "O texto traduzido (disponível quando o status é 'completed').",
            },
            error: {
              type: 'string',
              nullable: true,
              description: "Mensagem de erro (disponível quando o status é 'failed').",
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'A data e hora de criação da solicitação.',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'A data e hora da última atualização.',
            },
          },
          example: {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            originalText: "Hello, world!",
            targetLanguage: "Portuguese",
            status: "completed",
            translatedText: "Olá, mundo!",
            error: null,
            createdAt: "2025-06-17T22:50:15.123Z",
            updatedAt: "2025-06-17T22:50:18.456Z",
          },
        },
      },
    },
  },
  
  apis: ['./src/presentation/routes/*.js'],
};
