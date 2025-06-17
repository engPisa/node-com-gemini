import amqp from 'amqplib'

export class Consumer {
    constructor(amqpUrl, processRequestUseCase){
        this.amqpUrl = amqpUrl;
        this.processRequestUseCase = processRequestUseCase;
        this.queueTranslation = 'q.translation.requests';
    }

    async start(){
        console.log('... WORKER: Esperando por mensagens de tradução.');
        try{
            const connection = await amqp.connect(this.amqpUrl);
            const channel = await connection.createChannel();
            await channel.assertQueue(this.queueTranslation, { durable: true});
            channel.prefetch(1);

            channel.consume(this.queueTranslation, async(msg) =>{
                if (msg !== null) {
                    const message = JSON.parse(msg.content.toString());
                    console.log(`[📥] WORKER: Requisição recebida para ${message.requestId}`);
                    await this.processRequestUseCase.execute(message);
                    channel.ack(msg);
                }
            },{ noAck: false });
        } catch(error){
            console.error(`❌ WORKER: Erro no consumidor principal:`, error);
        }
    }
}