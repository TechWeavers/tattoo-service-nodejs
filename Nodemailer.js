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
            html: "<h1> Olá " + nome + "!</h1> <p>Tudo bem? Que tal uma visitinha ao estúdio para vermos como está a sua tatuagem hein? ficaremos contentes em avaliarmos seu processo de cicatrização!</p><br><p>Aqui estão algumas dicas que podem ajudar na recuperação da sua nova tatuagem:</p><br><br><h5>HIGIENIZAÇÃO:</h5><p>•Lavar com água morna (água muito gelada não limpará o suficiente e água muito quente pode abrir demais os poros, expulsar mais tinta do que deveria e estourar o traço).</p><p>•Usar sabonete neutro (os mais fáceis de encontrar são: glicerina da granado ou Johnsons baby. NÃO usar protex nem lifeboy, pois eles matam bactérias que são importantes pra cicatrização)</p><p>•Lavar com a ponta dos dedos (NÃO esfregar com esponja, nem esfoliantes)</p><p>•Tome banhos mais rápidos</p><p>•Não deixe a água do chuveiro escorrendo, nem batendo em cima da tattoo. A pressão da água pode estourar o traço.</p><p>•Durante o banho tome cuidado para que xampu e condicionador não caiam em cima da tattoo.</p><p>•Seque com papel toalha (é importante que seja papel novo, de uso exclusivo para a tatuagem, não use o que está na sua cozinha) sem esfregar, tirando toda a umidade. NÃO use toalhas normais. Elas podem deixar fiapinhos que podem ter bactérias e que podem vir a infeccionar sua tatuagem.</p><br><h5>HIDRATAÇÃO:</h5><p>•Passe uma camada bem fina de pomada CICAPLAST B5, da La Roche</p><p>•Efetue toda a limpeza, hidratação e troca de plástico pelo menos duas vezes ao dia. Uma vez pela manhã para passar o dia e uma vez à noite para dormir. (Importante: no primeiro dia, você efetuará a  troca de bandagem a cada 3/4 horas)</p><p>•Use o plástico por 3 dias. É importante para proteger de bactérias e também para que a cicatrização fique mais delicada, refletindo na “vida útil” da tattoo. (Da mesma forma que o papel toalha, o plástico deve ser novo e de uso exclusivo para a tattoo)</p><p>•O principal período de limpeza e hidratação é de 15 dias, porém você pode continuar usando a pomada por até 30 dias. Após 30 dias, suspenda o uso da pomada e passe protetor solar nela todos os dias</p><br><h5>ALIMENTAÇÃO:</h5><p>•15 dias sem comer carne de porco e derivados (presunto, linguiça, salsicha, bacon, etc)</p><p>•15 dias sem comer peixe (de água doce e salgada) e coisas vindas do mar (alga, camarão, marisco, etc)</p><p>•5 dias sem bebidas alcoólicas, principalmente destilados</p><p>•EVITAR: comida processada, comida gordurosa, ovo, chocolate, açaí, oleaginosas, comidas com muito sal e sódio</p><p>•Beba bastante água!</h5><br><p>DEMAIS RESTRIÇÕES:</h5><p>•Você precisa proteger sua tattoo do Sol, porém não pode passar protetor solar antes de 30 dias. Você a protegerá com roupas, de preferência roupas claras que não puxem tanto calor</p><p>•7 dias sem exercícios físicos. Isso inclui qualquer tipo de exercício ou esforço. A tinta começa a  enrijecer debaixo da pele com sete dias. Antes desse período, todo o esforço pode fazer com que a tinta ande debaixo da pele, principalmente traços finos.</p><p>•No mínimo 30 dias sem sol, mar, piscina, sauna, hidromassagem, massagem, nem nada que tenha excesso de água e/ou bactérias e atrito</p><p>•Não coçar</p><p>•Não arrancar casquinha</p><p>• Evite que bichos de estimação cheguem perto da tattoo, nem deite onde eles estiveram e podem ter deixado pêlos</p><br><br>Qualquer dúvida contate o nosso colaborador. Obrigado pela preferência :)</p>"

        })
    }

    static recuperacaoSenha(email, nome, token) {
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
            html: "<h1> Olá" + nome + "!</h1> <p> Este email está sendo enviado pois foi feita uma solicitação de recuperação de senha. Caso não tenha sido solicitado por você, favor desconsiderar.</p> <p> Clique no link para criar uma nova senha: http://127.0.0.1:8081/recuperar-senha/" + token + " </p>",
            text: "Este email foi enviado usando o NodeMailer"
        })
    }
}

module.exports = { email };