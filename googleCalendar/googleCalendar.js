const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
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


    static async createEvent(nome_evento, local_evento, descricao_evento, data_evento, hora_inicio, hora_termino, id_cliente) {

        // validação de dados do cliente
        const Cliente = require("../models/ClienteFicha")

        const id = id_cliente;
        const cliente = await Cliente.findByPk(id);

        //obter o valor do campo "email" do cliente e armazenar na variável email_cliente
        if (cliente) {
            const { email } = cliente
            const { nome } = cliente
            const email_cliente = email;
            const nome_cliente = nome;

            const auth = await authorize();
            const calendar = google.calendar({ version: 'v3', auth });

            const event = {
                summary: nome_evento,
                location: local_evento,
                description: descricao_evento,
                start: {
                    dateTime: data_evento + "T" + hora_inicio
                        /*formato de data e horário '2023-11-23T06:00:00'*/
                        ,
                    timeZone: 'America/Sao_Paulo',
                },
                end: {
                    dateTime: data_evento + "T" + hora_termino,
                    timeZone: 'America/Sao_Paulo',
                },
                attendees: [{
                    email: email_cliente,
                    displayName: nome_cliente,
                    responseStatus: "needsAction"
                }],
                reminders: {
                    useDefault: false,
                    overrides: [{
                        method: "email",
                        "minutes": 24 * 60
                    }],
                    sendUpdates: "all"
                }


            };

            calendar.events.insert({
                calendarId: 'sixdevsfatec@gmail.com',
                resource: event,
            }, (err, res) => {
                if (err) return console.error('Erro ao inserir evento:', err);

                console.log('Evento inserido:', res.data);
            });


        }
    }
}









authorize().then(listEvents).catch(console.error);

module.exports = { googleCalendar };