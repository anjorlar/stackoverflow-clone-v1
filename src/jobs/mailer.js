const rabbitMq = require('../libs/rabbitmq');
const cron = require('node-schedule');
const sendMail = require('../utils/sendMail')
const QUEUE_NAME = 'SUBSCRIBE'

cron.scheduleJob('* */2 * * * *', async () => {
    // let data = await rabbitMq.receiveQueue(QUEUE_NAME)
    // data = JSON.parse(data)
    // console.log(">>>>>>>>> data mailer", data)
    // const user = data.data.map(user => { user.email })
    // console.log(">>>>>>>>> user user  mailer", user)
    // await sendMail(user,
    //     'stack', 'answers',
    //     `The question you subscribed to ${data.question} was answered. Here is the answer ${data.answer.description}`)
})

module.exports = cron