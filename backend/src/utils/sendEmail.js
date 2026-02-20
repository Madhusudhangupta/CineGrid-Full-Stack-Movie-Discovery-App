const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendEmail(to ,subject, html) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html
        });
        logger.info(`Email sent: ${info.messageId}`);
        return true;
    } catch (err) {
        logger.error(`Senf email error: ${err.message}`);
        return false;
    }
}

module.exports = sendEmail;