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
            html: "<h1> Olá " + nome + "!</h1><br><p>Sua tatuagem foi marcada com sucesso!<br> Qualquer dúvida contate o nosso colaborador. Obrigado pela preferência :)</p>"
        })


    }

    static enviarEmail24HorasPosProcedimento(email, nome) {
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
            subject: "Email Pós Procedimento",
            html: "<h1>Ei " + nome + "!</h1><br><p>Passando pra avisar que a sua tatuagem está marcada para daqui 24 horas.<br>Qualquer dúvida contate o nosso colaborador. Obrigado pela preferência :)</p>"
        })
    }

    static enviarEmail15DiasPosProcedimento(email, nome) {
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
            subject: "Convite ao Estúdio",
            html: "<h1> Olá " + nome + "!</h1> <p>Tudo bem? Que tal uma visitinha ao estúdio para vermos como está a sua tatuagem hein? ficaremos contentes em avaliarmos seu processo de cicatrização!</p> <p>Obrigado pela preferência :)</p>"
        })
    }
}

module.exports = { email };