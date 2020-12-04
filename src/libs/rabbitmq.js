const client = require('../db/rabbitmq');

class RabbitMQ {
    async sendQueue(QUEUE_NAME, message) {
        try {
            const createChannel = await client.createChannel()
            await createChannel.assertQueue(QUEUE_NAME)
            const status = await createChannel.sendToQueue(QUEUE_NAME, Buffer.from(message));
            console.log('status >>>>>', status)
        } catch (error) {
            console.log('error with send queue', error)
        }
    };

    async receiveQueue(QUEUE_NAME) {
        try {
            const channel = await client.createChannel()
            await channel.assertQueue(QUEUE_NAME)
            try {
                const res = await channel.consume(QUEUE_NAME, message => {
                    if (message !== null) {
                        (message.content.toString());
                        channel.ack(message)
                    } else {
                        'No message gotten'
                    };
                });
                console.log('>>>>>>>> res', res)
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