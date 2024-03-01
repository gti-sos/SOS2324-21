const API_BASE = '/api/v1/cause-of-deaths';

let express = require("express");
let app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.json());

var datos = [];

function API_MRC(app){

    // LOADINITIALDATA: El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData 
    //que al hacer un GET cree 10 o más datos en el array de NodeJS si está vacío.
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        if (datos.length === 0){
            let data = [
                { country_name: "Afghanistan", code: "AFG", year: 1990, meningitis: 2159, alzheimer: 1116, parkinson: 371, nutricional_deficiencie: 2087, malaria: 93 },
                { country_name: "Afghanistan", code: "AFG", year: 1991, meningitis: 2218, alzheimer: 1136, parkinson: 374, nutricional_deficiencie: 2153, malaria: 189 },
                { country_name: "Afghanistan", code: "AFG", year: 1992, meningitis: 2475, alzheimer: 1162, parkinson: 378, nutricional_deficiencie: 2441, malaria: 239 },
                { country_name: "Afghanistan", code: "AFG", year: 1993, meningitis: 2812, alzheimer: 1187, parkinson: 384, nutricional_deficiencie: 2837, malaria: 108 },
                { country_name: "Afghanistan", code: "AFG", year: 1994, meningitis: 3027, alzheimer: 1211, parkinson: 391, nutricional_deficiencie: 3081, malaria: 211 },
                { country_name: "Afghanistan", code: "AFG", year: 1995, meningitis: 3102, alzheimer: 1225, parkinson: 394, nutricional_deficiencie: 3131, malaria: 175 },
                { country_name: "Afghanistan", code: "AFG", year: 1996, meningitis: 3193, alzheimer: 1239, parkinson: 398, nutricional_deficiencie: 3175, malaria: 175 },
                { country_name: "Afghanistan", code: "AFG", year: 1997, meningitis: 3304, alzheimer: 1253, parkinson: 402, nutricional_deficiencie: 3250, malaria: 240 },
                { country_name: "Afghanistan", code: "AFG", year: 1998, meningitis: 3281, alzheimer: 1267, parkinson: 409, nutricional_deficiencie: 3193, malaria: 563 },
                { country_name: "Afghanistan", code: "AFG", year: 1999, meningitis: 3200, alzheimer: 1281, parkinson: 409, nutricional_deficiencie: 3115, malaria: 468 }
            ];
            for (let i = 0; i < data.length; i++){
                datos.push(data[i]);
            }
            res.sendStatus(201, "Data Created");
        } else {
            res.send(JSON.stringify(datos))
            res.sendStatus(200, "OK");
        }
    });

    // 1 POST
    app.post(API_BASE + "/", (req, res) => {
        let data = req.body;
        const datosFil = datos.some(j => j.name===data.name && j.year===data.year );
        if (datosFil){
            //Si el recurso ya existe: error 409
            res.sendStatus(409, "Conflict");
        } else if (data.length === 0){
            //Si el recurso no tiene datos: error 400
            res.sendStatus(400, "Bad Request");
        } else {
            //Si el recurso no existe: se añade
            datos.push(data);
            res.sendStatus(201, "Created");
        }

    });
    
    // 1 GET
    app.get(API_BASE + "/", (req, res) => {
        res.send(JSON.stringify(datos));
        req.sendStatus(200, "OK");
    });

    // 1 PUT
    app.put(API_BASE + "/", (req, res) => {
        //No está permitido hacer un put de todos los recursos
        //Si se intenta usar alguno de los métodos no permitidos 
        //por la tabla azul se debe devolver el código 405
        let data = req.body;
        res.sendStatus(405, "Method not Allowed");
    });

    // 1 DELETE
    app.delete(API_BASE + "/", (req, res) => {
        //Eliminar todos los datos
        datos.splice(0, datos.length);
        res.sendStatus(200, "OK");
    });

    // 2 POST
    app.post(API_BASE + "/:country_name", (req, res) => {
        //No está permitido hacer un post de un recurso concreto
        const pais = req.params.country_name;
        let data = req.body;
        res.sendStatus(405, "Method not Allowed");
    });

    // 2 GET
    app.get(API_BASE + "/:country_name", (req, res) => {
        //Devolver los datos de un país concreto
        const pais = req.params.country_name;
        const datosFiltrados = datos.filter(dato => dato.country_name === pais);
        if (datosFiltrados.length === 0){ // Si no hay datos, devolver 404
            res.sendStatus(404, "Not Found");
        } else { // Si hay datos, devolver 200 y los datos correspondientes
            res.send(JSON.stringify(datosFiltrados));
            res.sendStatus(200, "OK");
        }
    });

    // 2 PUT
    app.put(API_BASE + "/:country_name", (req, res) => {
        //actualizar un recurso en concreto
        const pais = req.params.country_name;
        let data = req.body;
        const datosFiltrados = datos.filter(dato => dato.country_name === pais);
        if (datosFiltrados.length === 0){ // Si no hay datos, devolver 404
            res.sendStatus(404, "Not Found");
        } else { // Si hay datos, actualizarlos y devolver 200 OK
            for (let i = 0; i < datos.length; i++){
                if (datos[i].country_name === pais){
                    datos[i] = data;
                }
            }
            res.sendStatus(200, "OK");
        }
    });

    // 2 DELETE
    app.delete(API_BASE + "/:country_name", (req, res) => {
        //Borrar un recurso en concreto, comprobando si existe
        const pais = req.params.country_name;
        const datosFiltrados = datos.filter(dato => dato.country_name === pais);

        if (datosFiltrados.length < datos.length){ 
            datos=datosFiltrados;
            res.sendStatus(200, "OK");
        } else { 
            res.sendStatus(404, "Not Found");
        }
    });

}

module.exports.mrc_v1 = API_MRC;