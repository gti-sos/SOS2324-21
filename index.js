let cool = require('cool-ascii-faces');
let express = require('express');
let bodyParser = require('body-parser')
let dataStore = require('nedb');

let resJMM = require('./index-JMM.js');
let resMRC = require('./index-MRC.js');
let resAMG = require('./index-AMG.js');

let api_MRC = require("./api/index-MRC.js");
let api_JMM = require("./api/index-JMM.js")
let api_AMG = require("./api/index-AMG.js");

let dbHappiness = new dataStore();

let app = express();

const PORT = (process.env.PORT || 10000);

app.use(express.static("./root"));

app.use(bodyParser.json());

app.get('/cool', (req, res) => {
    res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});

app.get('/samples/JMM', (req, res) => {
    res.send(`<html><body><h1>El resultado de la operación es ${resJMM}</h1></body></html>`);
});

app.get('/samples/MRC', (req, res) => {
    res.send(resMRC.media_por_pais(resMRC.datos_mrc, "country_name", "Afghanistan", "meningitis"))
});

app.get('/samples/AMG', (req, res) => {
    res.send(resAMG.media_coc_per_pais(resAMG.datos_a, "U.S.A."))
});

api_MRC.mrc_v1(app);
api_JMM(app, dbHappiness);
api_AMG(app);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

console.log(`Server inicializing...`);
