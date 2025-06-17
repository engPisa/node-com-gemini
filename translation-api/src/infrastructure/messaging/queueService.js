import amqp from 'amqplib';

export class QueueService {
    constructor(url){
        this.url = url;
        this.channel = null;
    }

    async connect(){
        try{
            const connection = await amqp.connect(this.url);
            this.channel = await connection.createChannel();
            console.log('✅ API: Conectado ao RabbitMQ');
        } catch (error){
            console.error('❌ API: Erro ao conectar ao RabbitMQ:', error);
            throw error;
        }
    }

    async publish(queueTranslate, message){
        if(!this.channel) throw new Error("Conexão com a fila não estabelecida.");
        await this.channel.assertQueue(queueTranslate,{ durable: true });
        this.channel.sendToQueue(queueTranslate, Buffer.from(JSON.stringify(message)),{ persistant:true });   
    }
}