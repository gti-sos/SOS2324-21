const API_BASE = '/api/v1/cause-of-deaths';

var initialReports = [
    { country_name: "Afghanistan", code: "AFG", year: 1990, meningitis: 2159, alzheimer: 1116, parkinson: 371, nutricional_deficiencie: 2087, malaria: 93 },
    { country_name: "Afghanistan", code: "AFG", year: 1991, meningitis: 2218, alzheimer: 1136, parkinson: 374, nutricional_deficiencie: 2153, malaria: 199 },
    { country_name: "Afghanistan", code: "AFG", year: 1992, meningitis: 2475, alzheimer: 1162, parkinson: 378, nutricional_deficiencie: 2441, malaria: 239 },
    { country_name: "Afghanistan", code: "AFG", year: 1993, meningitis: 2812, alzheimer: 1187, parkinson: 384, nutricional_deficiencie: 2837, malaria: 108 },
    { country_name: "Afghanistan", code: "AFG", year: 1994, meningitis: 3027, alzheimer: 1211, parkinson: 391, nutricional_deficiencie: 3081, malaria: 211 },
    { country_name: "Afghanistan", code: "AFG", year: 1995, meningitis: 3102, alzheimer: 1225, parkinson: 394, nutricional_deficiencie: 3131, malaria: 175 },
    { country_name: "Afghanistan", code: "AFG", year: 1996, meningitis: 3193, alzheimer: 1239, parkinson: 398, nutricional_deficiencie: 3175, malaria: 175 },
    { country_name: "Afghanistan", code: "AFG", year: 1997, meningitis: 3304, alzheimer: 1253, parkinson: 402, nutricional_deficiencie: 3250, malaria: 240 },
    { country_name: "Afghanistan", code: "AFG", year: 1998, meningitis: 3281, alzheimer: 1267, parkinson: 409, nutricional_deficiencie: 3193, malaria: 563 },
    { country_name: "Afghanistan", code: "AFG", year: 1999, meningitis: 3200, alzheimer: 1281, parkinson: 409, nutricional_deficiencie: 3115, malaria: 468 }

];

function loadBackendMRC(app, db){
    db.insert(initialReports);

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
                    db.insert(initialReports);
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

    // 1 POST
    app.post(API_BASE + "/", (req, res) => {
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
            db.update({ "country_name": req.params.country_name }, { "year": req.params.year }, { $set: body }, (err, numUpdated) => {
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