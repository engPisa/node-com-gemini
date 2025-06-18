import 'dotenv/config';
import express from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger.config.js';

import { CreateTranslationUseCase } from './src/application/use-cases/createTranslation.js';
import { GetTranslationStatusUseCase } from './src/application/use-cases/getTranslationStatusUseCase.js';
import { ProcessTranslationResultUseCase } from './src/application/use-cases/processTranslationResultUseCase.js';

import { PrismaTranslationRepository } from './src/infrastructure/database/prismaTranslationRepository.js';
import { QueueService } from './src/infrastructure/messaging/queueService.js';
import { QueueConsumer } from './src/infrastructure/messaging/queueConsumer.js';

import { TranslationController } from './src/presentation/controllers/translationController.js';
import { createTranslationRoutes } from './src/presentation/routes/translatioRoutes.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

async function server() {
    const translationRepository = new PrismaTranslationRepository();
    const queueService = new QueueService(process.env.RABBITMQ_URL);
    await queueService.connect();

    const createTranslationUseCase = new CreateTranslationUseCase(translationRepository, queueService);
    const getTranslationStatusUseCase = new GetTranslationStatusUseCase(translationRepository);
    const processTranslationResultUseCase = new ProcessTranslationResultUseCase(translationRepository);

    const queueConsumer = new QueueConsumer(process.env.RABBITMQ_URL, processTranslationResultUseCase);
    await queueConsumer.start();

    const translationController = new TranslationController(
        createTranslationUseCase,
        getTranslationStatusUseCase
    );

    const openDocs = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve. swaggerUi.setup(openDocs));

    const translationRoutes = createTranslationRoutes(translationController)
    app.use(translationRoutes);

    app.listen(PORT, () => {
        console.log(`🚀 API rodando na porta ${PORT}`);
        console.log(`📚 Documentação da API disponível em http://localhost:${PORT}/api-docs`);
    });
}

server().catch((err) => {
    console.error("Erro ao iniciar o servidor:", err);
});
