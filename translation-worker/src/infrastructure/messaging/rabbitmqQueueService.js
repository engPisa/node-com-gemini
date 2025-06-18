import amqp from 'amqplib';
import { QueueService } from '../../application/services/queueService.js';

export class RabbitMQQueueService extends QueueService{
    constructor(url){
        super();
        this.url = url;
        this.channel = null;
    }

    async connect(){
        try{
            const connection = await amqp.connect(this.url);
            this.channel = await connection.createChannel();
            console.log('✅ WORKER: Conectado ao RabbitMQ');
        } catch (error){
            console.error('❌ WORKER: Erro ao conectar ao RabbitMQ:', error);
            throw error;
        }
    }

    async publish(queueTranslation, message){
        if (!this.channel) throw new Error("Conexão com a fila não estabelecida.");
        await this.channel.assertQueue(queueTranslation, { durable: true});
        this.channel.sendToQueue(queueTranslation, Buffer.from(JSON.stringify(message)), { persistent: true});
    }
}