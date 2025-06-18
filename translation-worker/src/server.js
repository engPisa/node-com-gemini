import 'dotenv/config'

import { ProcessTranslationRequestUseCase } from './src/application/use-cases/processTranslationRequest.js'
import { RabbitMQQueueService } from './src/infrastructure/messaging/rabbitmqQueueService.js'
import { GeminiTranslationService } from './src/infrastructure/translation/geminiTranslationService.js'
import { Consumer } from './src/presentation/consumer.js'

async function server() {
    const queueService = new RabbitMQQueueService(process.env.RABBITMQ_URL);
    await queueService.connect(); 

    const translationService = new GeminiTranslationService(process.env.GEMINI_API_KEY);

    const processTranslationRequestUseCase = new ProcessTranslationRequestUseCase(queueService, translationService); // Renomeado para evitar confusão com a classe

    const consumer = new Consumer(process.env.RABBITMQ_URL, processTranslationRequestUseCase);
    await consumer.start();

    console.log('🚀 WORKER pronto e operacional.');
}

server();
