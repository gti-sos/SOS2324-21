/*A*/ import express, { response } from 'express';
import bodyParser from 'body-parser';
import dataStore from'nedb';
import {handler} from "./front/build/handler.js"; //asi conectamos con el frontend
import cors from "cors";
import {loadBackendMRC} from "./back/backend2-MRC.js";
import {loadBackendJMM} from "./back/backend-JMM.js";
import {api_AMG} from "./back/index-AMG.js";
import { error } from 'console';

/* B */
let dbHappiness = new dataStore();
let dbCauseDeaths = new dataStore();
let dbChocolates = new dataStore();

let app = express();

const PORT = (process.env.PORT || 10000);

//app.use(express.static("./root"));
app.use(bodyParser.json());
app.use(cors());
/* C */
app.get('/api/v1/happiness-reports/docs', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/32994781/2sA2xh2swf');
});

app.get('/api/v2/cause-of-deaths/docs', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/32977574/2sA2xb7GDm');
});

app.get('/api/v1/cause-of-deaths/docs', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/32977574/2sA35MzK18');
});


loadBackendJMM(app, dbHappiness);
loadBackendMRC(app, dbCauseDeaths);
api_AMG(app, dbChocolates);

app.use(handler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

console.log(`Server inicializing...`);
