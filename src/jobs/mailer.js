// const rabbitMq = require('../libs/rabbitmq');
// const cron = require('node-schedule');
const sendMail = require('../utils/sendMail')
// const QUEUE_NAME = 'SUBSCRIBE'

// cron.scheduleJob('* */2 * * * *',
module.exports = mailSender = async (msg) => {
    try {
        // console.log('scheduler to mail answers to followers running')
        // let data = await rabbitMq.receiveQueue(QUEUE_NAME)
        const data = JSON.parse(msg)
        // console.log(">>>>>>>>> cron job")
        const user = await data.data.map(user => user.email)
        console.log(">>>>>>>>> user", user)
        await sendMail(user,
            'stack',
            'answers',
            `The question you subscribed to ${data.question} was answered. Here is the answer ${data.answer.description}`)
    } catch (error) {
        console.log('error running the sendmail function', error)
    }
}
// })

// module.exports = cron 