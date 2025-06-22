import { __filename, __dirname, SECRET_KEY, MAIL, MAILPASS } from '../config/appConfig.js'
import nodemailer from 'nodemailer';

export const sendMeMessage = async (req, res) => {
    const { email, name, text } = req.body
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            post: 465,
            secure: true,
            auth: {
                user: MAIL,
                pass: MAILPASS
            },
        });
    
        const mailOptions = {
            from: `SkyBin <${MAIL}>`,
            to: 'bugaevdaniil1407@icloud.com',
            subject: `Сообщение от пользователя ${name}`,
            html: `<span>${email}</span>
                    <p>${text}</p>`
                };
                
        transporter.sendMail(mailOptions, (err, info) => {
            if(err) return console.error(err)
            console.log(`Email sent ${info}`)
        });
        
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: `Error: ${error}` });
    }
}