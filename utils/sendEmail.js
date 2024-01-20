import nodemailer from 'nodemailer';

export const sendEmail = async (from,to,subject,text) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }

    });

    await transporter.sendMail({
        from:from,
        to:to,
        subject:subject,
        text:text
    })
}