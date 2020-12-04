const amqp = require('amqplib');
const config = require('../config/settings');
const RABBIT_HOST = config.RABBITMQ.RABBIT_HOST
const RABBIT_PORT = config.RABBITMQ.RABBIT_PORT
const RABBIT_USERNAME = config.RABBITMQ.RABBIT_USERNAME
const RABBIT_PASSWORD = config.RABBITMQ.RABBIT_PASSWORD

// const client = amqp.connect(`amqp://${RABBIT_HOST}`,
// const client = amqp.connect(`${config.RABBITMQ.url}`,
//     function (err, conn) {
//         console.log("Enter in callback", conn);
//         if (err) {
//             console.error("[AMQP]", err.message);
//             return err;
//         }
//         conn.on("error", function (err) {
//             if (err.message !== "Connection closing") {
//                 console.error("[AMQP] conn error", err.message);
//             }
//         });
//         conn.on("close", function () {
//             console.error("[AMQP] reconnecting");
//             return;
//         });

//         console.log("[AMQP] connected");
//         amqpConn = conn;
//         callback(null, "Success");
//     });
console.log('client client', `${config.RABBITMQ.url}`);
async function client() {
    try {
        // const connection = await amqp.connect(`amqp://${RABBIT_HOST}`)
        const connection = await amqp.connect(`${config.RABBITMQ.url}`);
        console.log('connection >>>>>', connection)
        connection.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        connection.on("close", function () {
            console.error("[AMQP] reconnecting");
            return;
        });
        const channel = await connection.createChannel();
        console.log('RabbitMQ connection established');
        console.log('connection >>>>>', channel)
        return channel
    } catch (error) {
        console.log('Cannot establish connection to RabbitMQ');
        process.exit(1);
    }
}
module.exports = client
