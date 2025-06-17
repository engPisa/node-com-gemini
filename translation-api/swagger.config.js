export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Translation API',
      version: '1.0.0',
      description: 'API para solicitar traduções de texto de forma assíncrona utilizando o gemini.',
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
  },

  apis: ['./src/presentation/routes/*.js', './src/domain/*.js'],
};