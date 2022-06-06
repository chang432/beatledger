var logger = require("./logger")
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendMail = () => {
  const msg = {
    to: 'andre888chang@gmail.com', // Change to your recipient
    from: 'thebeatblockofficial@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }

  sgMail
    .send(msg)
    .then(() => {
      logger.log('Email sent')
    })
    .catch((error) => {
      logger.error(error)
    })
}


