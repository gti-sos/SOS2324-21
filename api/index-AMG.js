const API_BASE = '/api/v1/chocolate-ratings';
let resAMG = require('./index-AMG.js');

var datos = resAMG.datos;

data=[];

module.exports = (app) => {

    app.get(API_BASE+"/loadInitialData",(req,res)=>{
        if(data.lenght===0){
            data=data.concat(datos)
            res.sendStatus(201, "Created")
        }else{
            res.send(JSON.stringify(data));
            res.sendStatus(200, "Ok");
        }

    });




}