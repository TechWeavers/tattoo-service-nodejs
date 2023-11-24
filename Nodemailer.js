const nodemailer = require("nodemailer");

class email {

    static enviarEmail(email, nome) {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "sixdevsfatec@gmail.com",
                pass: "bdsx clop ykqi thaw"
            }
        })

        transport.sendMail({
            from: "sixdevsfatec@gmail.com",
            to: email,
            subject: "Enviando email com Nodemailer teste com express",
            html: "<h1> Olá" + nome + "!</h1> <p> Só passando aqui para avisar que a sua tatuagem esá confirmada!</p> <p> Agradecemos pela preferência! </p>",
            text: "Este email foi enviado usando o NodeMailer"
        })
    }
}

module.exports = { email };