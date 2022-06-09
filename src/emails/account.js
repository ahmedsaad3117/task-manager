const sgMail = require("@sendgrid/mail");
const sendergridAPIKey = process.env.SENGRID_API_KEY
  

sgMail.setApiKey(sendergridAPIKey);

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'ahmedsaad3117@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the appm ${name}. let me know how you get along with the app.`
    })
}

const sendGoodByEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'ahmedsaad3117@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the appm ${name}. let me know how you get along with the app.`
    })
}


module.exports = { 
    sendWelcomeEmail,
    sendGoodByEmail
}