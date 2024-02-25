let cool = require('cool-ascii-faces');
let express = require('express');


let resJMM = require('./index-JMM.js');
let resMRC = require('./index-MRC.js');
let resAMG = require('./index-AMG.js');

let app = express();

const PORT = (process.env.PORT || 10000);

app.use(express.static("./root"));

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
    res.send(resAMG.calcMediaCocPerPais(resAMG.datos, "U.S.A."))
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

console.log(`Server inicializing...`);
