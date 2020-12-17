const client = require('../db/rabbitmq');
const sendMail = require('../jobs/mailer')


class RabbitMQ {
    async sendQueue(QUEUE_NAME, message) {
        try {
            const connect = await client()
            const createChannel = await connect.createChannel()
            console.log('channel created on rabbit mq send to queue')
            await createChannel.assertQueue(QUEUE_NAME, { durable: true })
            await createChannel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
            console.log('sent from receiving queue successful')
        } catch (error) {
            console.log('error with send queue', error)
        }
    };

    async receiveQueue(QUEUE_NAME) {
        try {
            const connect = await client();
            const channel = await connect.createChannel(QUEUE_NAME);
            console.log('channel created on rabbit mq receive from queue')
            await channel.assertQueue(QUEUE_NAME, { durable: true });
            await channel.prefetch(1);
            try {
                await channel.consume(QUEUE_NAME, async message => {
                    try {
                        const res = await (message.content.toString())
                        if (res) {
                            await sendMail(res)
                            channel.ack(message)
                            console.log('sent from consumer queue successful')
                        } else {
                            'No message gotten'
                        };
                    } catch (error) {
                        console.log('error with sending message to queue', error)
                    }
                });
            } catch (e) {
                console.log('error with cosuming message', e)
            }
        } catch (error) {
            console.log('error with receive queue', error)
        }
    };

}

const rabbitMq = new RabbitMQ()
module.exports = rabbitMq