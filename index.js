let express = require('express');
let bodyParser = require('body-parser')
let dataStore = require('nedb');

let api_MRC = require("./api/index-MRC.js");
let api_JMM = require("./api/index-JMM.js")
let api_AMG = require("./api/index-AMG.js");

let dbHappiness = new dataStore();
let dbCauseDeaths = new dataStore();
let dbChocolates = new dataStore();

let app = express();

const PORT = (process.env.PORT || 10000);

app.use(express.static("./root"));

app.use(bodyParser.json());

app.get('/api/v1/happiness-reports/docs', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/32994781/2sA2xh2swf');
});

app.get('/api/v1/cause-of-deaths/docs', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/32977574/2sA2xb7GDm');
});

api_JMM(app, dbHappiness);
api_MRC(app, dbCauseDeaths);
api_AMG(app, dbChocolates);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

console.log(`Server inicializing...`);
