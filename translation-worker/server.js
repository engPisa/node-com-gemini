import 'dotenv/config'

import { ProcessTranslationRequestUseCase } from './src/application/use-cases/processTranslationRequest'
import { RabbitMQQueueService } from './src/infrastructure/messaging/rabbitmqQueueService'
import { GeminiTranslationService } from './src/infrastructure/translation/geminiTranslationService'
import { Consumer } from './src/presentation/consumer'

async function server() {
    const queueService = new RabbitMQQueueService(process.env.RABBITMQ_URL);
    await queueService.connect(); // Use o método de instância para conectar

    const translationService = new GeminiTranslationService(process.env.GEMINI_API_KEY);

    const processTranslationRequestUseCase = new ProcessTranslationRequestUseCase(queueService, translationService); // Renomeado para evitar confusão com a classe

    const consumer = new Consumer(process.env.RABBITMQ_URL, processTranslationRequestUseCase);
    await consumer.start();

    console.log('🚀 WORKER pronto e operacional.');
}

server();
