const nodemailer = require('nodemailer')
const config = require('../config/settings');
const logger = require('./logger')
const sendMail = async (to, from, subject, message) => {
    const msg = { to, subject, text: message }
    try {
        const transporter = nodemailer.createTransport({
            host: config.EMAIL.NODEMAILER_HOST,
            service: config.EMAIL.NODEMAILER_PORT,
            port: config.EMAIL.NODEMAILER_PORT,
            auth: {
                user: config.EMAIL.NODEMAILER_USER,
                pass: config.EMAIL.NODEMAILER_PASSWORD
            },
        });
        const mailOptions = {
            text: message,
            to,
            from,
            subject
        };
        let info = await transporter.sendMail(mailOptions)
        console.log('message sent message Id: ', info.messageId)
    } catch (err) {
        console.log('error sending message', err)
        return false
    }
}

module.exports = sendMail