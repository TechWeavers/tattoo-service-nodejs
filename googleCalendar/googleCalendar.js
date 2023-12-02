const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const crypto = require("crypto");

// validação de dados do cliente
const Cliente = require("../models/Cliente")


// importando a entidade cópiaEventos que vai copiar cada evento da API
const copiaEventos = require("../models/copiaEventos");
const { Controller_Cliente } = require('../Controller_Cliente');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'teste-api-calendar.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */


// Refer to the Node.js quickstart on how to setup the environment:
// https://developers.google.com/calendar/quickstart/node
// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
// stored credentials.

async function listEvents() {
    const auth = await authorize();
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });


    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
    }
    console.log('Upcoming 10 events:');
    events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
    });


}


class googleCalendar {

    static async createEvent(nome_evento, local_evento, descricao_evento, data_evento, hora_inicio, hora_termino, email_cliente, nome_cliente, email_colaborador, nome_colaborador) {
        try {
            //obter o valor do campo "email" do cliente e armazenar na variável email_cliente
            if (nome_cliente && email_cliente) {
                const auth = await authorize();
                const calendar = google.calendar({ version: 'v3', auth });
                const randomUUID = crypto.randomUUID();
                const randomUUID2 = crypto.randomUUID();
                const event = {
                    summary: nome_evento,
                    location: local_evento,
                    description: descricao_evento,
                    start: {
                        dateTime: data_evento + "T" + hora_inicio + ":00",
                        /*formato de data e horário '2023-11-23T06:00:00'*/

                        timeZone: 'America/Sao_Paulo',
                    },
                    end: {
                        dateTime: data_evento + "T" + hora_termino + ":00",
                        timeZone: 'America/Sao_Paulo',
                    },
                    iCalUID: randomUUID,
                    attendees: [{
                            email: email_cliente,
                            displayName: "Cliente: " + nome_cliente,
                            responseStatus: "needsAction"
                        },
                        {
                            email: email_colaborador,
                            displayName: "Tatuador: " + nome_colaborador,
                            responseStatus: "needsAction"
                        }
                    ],
                    reminders: {
                        useDefault: false,
                        overrides: [{
                            method: "email",
                            "minutes": 24 * 60
                        }],
                        sendUpdates: "all",

                    }

                };

                const inserirEvento = calendar.events.insert({
                    calendarId: 'sixdevsfatec@gmail.com',
                    resource: event,
                }, (err, res) => {
                    if (err) return console.error('Erro ao inserir evento:', err);

                    console.log('Evento inserido:', res.data);

                    // tratamento de data
                    let data_formatada = data_evento.split("-");
                    let dia = data_formatada[2];
                    let mes = data_formatada[1];
                    let ano = data_formatada[0];
                    let data_ofc = dia + "/" + mes + "/" + ano;
                    copiaEventos.create({
                        nome_evento: nome_evento,
                        nome_cliente: nome_cliente,
                        email_cliente: email_cliente,
                        nome_colaborador: nome_colaborador,
                        data_evento: data_ofc,
                        hora_inicio: hora_inicio,
                        hora_termino: hora_termino,
                        status: "agendado",
                        id_procedimento_API: event.iCalUID
                    })
                })






            }
        } catch {
            console.log("erro ao inserir evento na agenda")
        }
    }

    static async deleteEvent(id_procedimento_API) {
        const auth = await authorize();
        const calendar = google.calendar({ version: 'v3', auth });

        const res = await calendar.events.delete({ calendarId: "sixdevsfatec@gmail.com", eventId: id_procedimento_API });
        if (res.data === '') {
            return res.data;
        } else {
            return "erro ao deletar agendamentos";
        };
    }

    static async deleta(eventId) {
        const auth = await authorize();
        const calendar = google.calendar({ version: 'v3', auth });
        const calendarId = "sixdevsfatec@gmail.com";
        try {
            let response = await calendar.events.delete({
                auth: auth,
                calendarId: calendarId,
                eventId: eventId
            });


        } catch (error) {
            console.log(`Error at deleteEvent --> ${error}`);
            return 0;
        }
    };
}









authorize().then(listEvents).catch(console.error);

module.exports = { googleCalendar };