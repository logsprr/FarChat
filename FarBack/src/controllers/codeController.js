const express = require('express');
const User = require ('../models/user');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/code', async (req, res)=>{
    try{
        const user = await User.create(req.body);
        console.log(user);
        sendcode(user);
        return res.send({user});
    }
    catch(err){
        return res.status(400).send({error : 'Falha no envio'});
    }
});

async function sendcode(user){
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'corinthiaswwyy@gmail.com', 
                pass: '2502199926091999badia' 
            }
        });
        let info = await transporter.sendMail({
            from: '"FarChat App 👻" <corinthiaswwyy@gmail.com>',
            to: user.email, 
            subject: 'Código de Verificação', 
            text: 'Segue o código de verificação   ' + user.code, 
        });
    
        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = app => app.use('/send', router);