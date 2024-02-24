let cool = require('cool-ascii-faces');
let express = require('express');
let resJMM = require('./index-JMM.js');

let app = express();

const PORT = (process.env.PORT || 10000);

app.use(express.static("./root"));

app.get('/cool', (req,res)=> {
    res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});

app.get('/samples/JMM', (req, res) => {
    res.send(`<html><body><h1>El resultado de la operación es ${resJMM}</h1></body></html>`);
});

app.listen(PORT, () =>{
    console.log(`Server listening on port ${PORT}`)
});

console.log(`Server inicializing...`);
