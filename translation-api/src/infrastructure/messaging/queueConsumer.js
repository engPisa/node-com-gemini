import amqp from 'amqplib';

export class QueueConsumer {
    constructor(amqpUrl, processResultUseCase){
        this.amqpUrl = amqpUrl;
        this.processResultUseCase = processResultUseCase;
        this.queueTranslate = 'q.translation.result';
    }

    async start(){
        console.log('... API: Ouvinte de resultados esperando por mensagens.');
        try{
            const connection = await amqp.connect(this.amqpUrl);
            const channel = await connection.createChannel();
            await channel.assertQueue(this.queueTranslate, { durable: true });

            channel.consume(this.queueTranslate, async(msg) => {
                if(msg !== null){
                    const message = JSON.parse(msg.content.toString());
                    console.log(`[📥] API: Resultado recebido para ${message.requestId}`);

                    await this.processResultUseCase.execute(message);
                    channel.ack(msg);
                }
            }, { noAck: false });
        } catch (error){
            console.error(`❌ API: Erro no ouvinte de resultados:`, error);
        }
    }
}