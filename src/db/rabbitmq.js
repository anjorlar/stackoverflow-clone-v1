const amqp = require('amqplib');
const config = require('../config/settings');
const RABBIT_HOST = config.RABBITMQ.RABBIT_HOST
const RABBIT_PORT = config.RABBITMQ.RABBIT_PORT
const RABBIT_USERNAME = config.RABBITMQ.RABBIT_USERNAME
const RABBIT_PASSWORD = config.RABBITMQ.RABBIT_PASSWORD

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(`${process.env.RABBITMQ_URL}`);
        console.log('connected to rabbit mq')
        return connection;
    } catch (error) {
        console.log("Cannot establish connection to RabbitMQ", error);
        process.exit(1);
    }
}


module.exports = connectRabbitMQ
