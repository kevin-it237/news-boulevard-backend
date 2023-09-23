const express = require('express')
const router = express.Router()
const sendMailGmail = require('../mailing/send_email')

router.post('/email/send', (req, res) => {
    let isError = false;
    req.body.emails.forEach((email, i) => {
        sendMailGmail(req.body.object, email, JSON.parse(req.body.html), (error, info) => {
            if (error) {
                isError = true;
                return res.status(500).json({
                    "error": error
                })
            }
            console.log('Message sent: %s', info.messageId);
            if (req.body.emails.length == i+1) {
                return res.status(200).json({
                    mail: "Email sent",
                })
            }
        });
    });
})

module.exports = router