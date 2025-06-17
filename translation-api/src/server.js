import 'dotenv/config';
import express from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../swagger.config.js';

import { CreateTranslationUseCase } from './application/use-cases/createTranslation.js';
import { GetTranslationStatusUseCase } from './application/use-cases/getTranslationStatusUseCase.js';
import { ProcessTranslationResultUseCase } from './application/use-cases/processTranslationResultUseCase.js';

import { PrismaTranslationRepository } from './infrastructure/database/prismaTranslationRepository.js';
import { QueueService } from './infrastructure/messaging/queueService.js';
import { QueueConsumer } from './infrastructure/messaging/queueConsumer.js';

import { TranslationController } from './presentation/controllers/translationController.js';
import { createTranslationRoutes } from './presentation/routes/translatioRoutes.js';

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
