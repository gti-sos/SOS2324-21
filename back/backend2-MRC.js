const API_BASE = '/api/v2/cause-of-deaths';
import { datos_mrc } from './datosMRC.js';
import request from 'request';

var path_mrc = '/api/proxy';

function loadBackendMRC(app, db){
    //db.insert(initialReports);


    app.get(API_BASE + "/loadInitialData", (req, res) => {

        // Paginación
        const limit = parseInt(req.query.limit) || 10; // Comprueba si en la petición está el parámetro que indica cuántos elementos mostrar por página
        const offset = parseInt(req.query.offset) || 0; // Comprueba si en la petición está el parámetro que indica cuántos elementos saltarse

        // Consulta con la paginación   
        db.find({}).skip(offset).limit(limit).exec((err, data) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (data.length === 0) { //si esta vacío, crea los datos
                    db.insert(datos_mrc);
                    res.sendStatus(201, "Data Created");
                } else {
                    res.send(JSON.stringify(data.map((d) => {
                        delete d._id;
                        return d;
                    })));
                }
            }
        });
    });

    app.use(path_mrc, function (req, res) {
        var url = req.url.replace('/?url=', '');
        console.log('piped: ' + req.url);
        req.pipe(request(url)).pipe(res);
    });

    //integracion GitHub
    app.get(API_BASE + '/getAccessTokenGH', async function (req, res) {
        console.log("New GET to /cause-of-deaths/getAccessTokenGH");
        const params = '?client_id=' + req.query.client_id + '&client_secret=' + req.query.client_secret + '&code=' + req.query.code;
        await fetch('https://github.com/login/oauth/access_token'+params, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {return response.json()})
        .then(data => {    
            res.status(200).json(data);
        });
    });

    app.get(API_BASE + '/getGH_info', async function (req, res) {
        console.log("New GET to /cause-of-deaths/getGH_info");
        const result = await fetch(req.query.url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.query.access_token
            }
        });
        const data = await result.json();
        res.status(200).json(data);
    });

    // 1 POST
    app.post(API_BASE + "/", (req, res) => {
/*G*/ 
        let report = req.body;
        let object_params = ["country_name", "code", "year", "meningitis", "alzheimer", "parkinson", "nutricional_deficiencie", "malaria"];
        const queryParams = Object.keys(report);
        const missingFields = object_params.filter(field => !queryParams.includes(field));
        if (missingFields.length > 0) {
            return res.status(400).send("Missing fields: " + missingFields.join(", "));
        } else if (queryParams.length !== 8) {
            return res.status(400).send("Incorrect fields size");
        } else {
            db.find({}, (err, reports) => {
                if (err) {
                    res.sendStatus(500, "Internal Error");
                } else {
                    if (reports.some(r => r.country_name === report.country_name && r.year === report.year)) {
                        res.sendStatus(409, "Conflict");
                    } else {
                        db.insert(report);
                        res.sendStatus(201, "Data Created");
                    }
                }
            })
        }
/* H */
    });

    // 1 GET
    app.get(API_BASE + "/", (req, res) => {
        // Paginacion
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        // parametros de mi objeto
        let object_params = ["country_name", "code", "year", "meningitis", "alzheimer", "parkinson", "nutricional_deficiencie", "malaria"];

        //construir consulta dinamica
        const consulta = {};

        for (let key in req.query) {
            if (key != "limit" && key != "offset") {
                if (!object_params.includes(key)) {
                    return res.sendStatus(400).json({ error: `El campos '${key}' no es válido` });
                }
                consulta[key] = isNaN(req.query[key]) ? new RegExp(req.query[key], 'i') : parseFloat(req.query[key]);
            }
        }

        // consulta con la paginacion
        db.find(consulta).skip(offset).limit(limit).exec((err, reports) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                res.send(JSON.stringify(reports.map((r) => {
                    delete r._id;
                    return r;
                })));
            }
        });
    });

    // 1 PUT
    app.put(API_BASE + "/", (req, res) => {
        //No está permitido hacer un put de todos los recursos
        //Si se intenta usar alguno de los métodos no permitidos 
        //por la tabla azul se debe devolver el código 405
        res.sendStatus(405, "Method not Allowed");
    });

    // 1 DELETE
    app.delete(API_BASE + "/", (req, res) => {
        db.remove({}, { multi: true }, function (err, numRemoved) {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                res.sendStatus(200, "OK");
            }
        });
    });

    // 2 POST
    app.post(API_BASE + "/:country_name", (req, res) => {
        //No está permitido hacer un post de un recurso concreto
        res.sendStatus(405, "Method not Allowed");
    });

    // 2 GET
    app.get(API_BASE + "/:country_name", (req, res) => {
        //Devolver los datos de un país concreto
        const country = req.params.country_name;
        db.find({}, (err, reports) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                const reportsData = reports.map((r) => {
                    delete r._id;
                    return r;
                });
                const countryData = reportsData.filter(r => r.country_name === country);
                if (countryData.length > 0) {
                    res.send(JSON.stringify(countryData));
                } else {
                    res.sendStatus(404, "Not found");
                }
            }
        })
    });

    // 2 PUT
    app.put(API_BASE + "/:country_name", (req, res) => {
        //actualizar un recurso en concreto
        let body = req.body;
        let object_params = ["country_name", "code", "year", "meningitis", "alzheimer", "parkinson", "nutricional_deficiencie", "malaria"];
        const queryParams = Object.keys(body);
        const missingFields = object_params.filter(field => !queryParams.includes(field));
        if (missingFields.length > 0) {
            return res.sendStatus(400), "Missing fields: " + missingFields.join(", ");
        } else if (queryParams.length !== 8) {
            return res.sendStatus(400, "Incorrect fields size");
        } else {
            db.update({ "country_name": req.params.country_name }, { $set: body }, (err, numUpdated) => {
                if (err) {
                    res.sendStatus(500, "Internal Server Error");
                } else {
                    if (numUpdated === 0) {
                        res.sendStatus(404, "Not Found");
                    } else {
                        res.sendStatus(200, "OK");
                    }
                }
            });
        }
    });

    // 2 DELETE
    app.delete(API_BASE + "/:country_name", (req, res) => {
        //Borrar un recurso en concreto, comprobando si existe
        const country = req.params.country_name;
        db.remove({ "country_name": country }, {}, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (numRemoved >= 1) {
                    res.sendStatus(200, "Deleted");
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });

    // por dos campos
    // GET 3
    app.get(API_BASE + "/:country_name/:year", (req, res) => {
        //Devolver los datos de un país concreto
        const country = req.params.country_name;
        db.find({}, (err, reports) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                const reportsData = reports.map((r) => {
                    delete r._id;
                    return r;
                });
                const countryData = reportsData.filter(r => r.country_name === country && r.year === parseInt(req.params.year));
                if (countryData.length > 0) {
                    res.send(JSON.stringify(countryData[0]));
                } else {
                    res.sendStatus(404, "Not found");
                }
            }
        })
    });

    // 3 PUT
    app.put(API_BASE + "/:country_name/:year", (req, res) => {
        //actualizar un recurso en concreto
        let body = req.body;
        let object_params = ["country_name", "code", "year", "meningitis", "alzheimer", "parkinson", "nutricional_deficiencie", "malaria"];
        const queryParams = Object.keys(body);
        const missingFields = object_params.filter(field => !queryParams.includes(field));
        if (missingFields.length > 0) {
            return res.status(400).send("Missing fields: " + missingFields.join(", "));
        } else if (queryParams.length !== 8) {
            return res.status(400).send("Incorrect fields size");
        } else if (body.year === parseInt(req.params.year) && body.country_name === req.params.country_name) {
            db.update({ "country_name": req.params.country_name, "year": parseInt(req.params.year) }, { $set: body }, (err, numUpdated) => {
                if (err) {
                    res.sendStatus(500, "Internal Server Error");

                } else {
                    if (numUpdated === 0) {
                        res.sendStatus(404, "Not Found");
                        console.log(res.body)
                    } else {
                        res.sendStatus(200, "OK");
                    }
                }
            });
        }
        else {
            res.sendStatus(400, "Bad Request");
        }

    });

    // 3 DELETE
    app.delete(API_BASE + "/:country_name/:year", (req, res) => {
        //Borrar un recurso en concreto, comprobando si existe
        const country = req.params.country_name;
        const year = parseInt(req.params.year);
        db.remove({ "country_name": country }, {"year": year}, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (numRemoved >= 1) {
                    res.sendStatus(200, "Deleted");
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });

};

export {loadBackendMRC};