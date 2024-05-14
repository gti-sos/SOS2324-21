import request from 'request';

const API_BASE = '/api/v1/happiness-reports';


var initialReports = [
    {
        country_name: "Afghanistan",
        year: 2008,
        gdp: 7.370,
        social_support: 451,
        healthy_life_expectancy: 50.800,
        generosity: 168,
        possitive_affect: 518,
        negative_affect: 258
    },
    {
        country_name: "Afghanistan",
        year: 2009,
        gdp: 7.540,
        social_support: 552,
        healthy_life_expectancy: 51.200,
        generosity: 190,
        possitive_affect: 584,
        negative_affect: 237
    },
    {
        country_name: "Afghanistan",
        year: 2010,
        gdp: 7.647,
        social_support: 539,
        healthy_life_expectancy: 51.600,
        generosity: 121,
        possitive_affect: 618,
        negative_affect: 275
    },
    {
        country_name: "Afghanistan",
        year: 2011,
        gdp: 7.620,
        social_support: 521,
        healthy_life_expectancy: 51.920,
        generosity: 162,
        possitive_affect: 611,
        negative_affect: 267
    },
    {
        country_name: "Afghanistan",
        year: 2012,
        gdp: 7.705,
        social_support: 521,
        healthy_life_expectancy: 52.240,
        generosity: 236,
        possitive_affect: 710,
        negative_affect: 268
    },
    {
        country_name: "Afghanistan",
        year: 2013,
        gdp: 7.725,
        social_support: 484,
        healthy_life_expectancy: 52.560,
        generosity: 61,
        possitive_affect: 621,
        negative_affect: 273
    },
    {
        country_name: "Afghanistan",
        year: 2014,
        gdp: 7.718,
        social_support: 526,
        healthy_life_expectancy: 52.880,
        generosity: 104,
        possitive_affect: 532,
        negative_affect: 375
    },
    {
        country_name: "Afghanistan",
        year: 2015,
        gdp: 7.702,
        social_support: 529,
        healthy_life_expectancy: 53.200,
        generosity: 80,
        possitive_affect: 554,
        negative_affect: 339
    },
    {
        country_name: "Afghanistan",
        year: 2016,
        gdp: 7.697,
        social_support: 559,
        healthy_life_expectancy: 53.000,
        generosity: 42,
        possitive_affect: 565,
        negative_affect: 348
    },
    {
        country_name: "Afghanistan",
        year: 2017,
        gdp: 7.697,
        social_support: 491,
        healthy_life_expectancy: 52.800,
        generosity: -121,
        possitive_affect: 496,
        negative_affect: 371
    }
];

function loadBackendJMM(app, db){

    app.get(API_BASE+"/loadInitialData", (req,res) => {
        // Paginación

        const limit = parseInt(req.query.limit) || 10; // Comprueba si en la petición está el parámetro que indica cuántos elementos mostrar por página
        const offset = parseInt(req.query.offset) || 0; // Comprueba si hay desplazamiento en la petición

        // Consulta con la paginación
        db.find({}).skip(offset).limit(limit).exec((err, reports) => {
            if(err){
                res.sendStatus(500, "Internal Error");
            } else {
                if(reports.length === 0) { //Si esta vacio, entonces crea los datos
                    db.insert(initialReports);
                    res.sendStatus(201, "Data Created");
                } else {
                    res.send(JSON.stringify(reports.map((r) => {
                        delete r._id;
                        return r;
                    })));
                }
            }
        });
    });

    app.post(API_BASE, (req, res) => {
        let report = req.body;
        let object_params = ["country_name","year","gdp","social_support","healthy_life_expectancy","generosity","possitive_affect","negative_affect"];
        const queryParams = Object.keys(report);
        const missingFields = object_params.filter(field => !queryParams.includes(field));
        if (missingFields.length > 0) {
            return res.status(400).send("Missing fields: " + missingFields.join(", "));
        } else if(queryParams.length !== 8) {
            return res.status(400).send("Incorrect fields size");
        } else {
            db.find({}, (err, reports) => {
                if(err){
                    res.sendStatus(500, "Internal Error");
                } else {
                    if(reports.some(r => r.country_name === report.country_name && r.year=== report.year)) {
                        res.sendStatus(409, "Conflict");
                    } else{
                        db.insert(report);
                        res.sendStatus(201, "Data Created");
                    }
                }
            })
        }
    });

    app.get(API_BASE, (req, res) => {
        // Paginación
        const limit = parseInt(req.query.limit) || 10; // Comprueba si en la petición está el parámetro que indica cuántos elementos mostrar por página
        const offset = parseInt(req.query.offset) || 0; // Comprueba si hay desplazamiento en la petición

        // Parámetros de mis objetos

        let object_params = ["country_name","year","gdp","social_support","healthy_life_expectancy","generosity","possitive_affect","negative_affect"];

        // Construir la consulta dinámicamente
        const consulta = {};

        for (let key in req.query) {
            if (key !== 'limit' && key !== 'offset') {
                if (!object_params.includes(key)) {
                    return res.status(400).json({ error: `El campo '${key}' no es válido` });
                }
                consulta[key] = isNaN(req.query[key]) ? new RegExp(req.query[key], 'i') : parseFloat(req.query[key]);
            }
        }

        // Consulta con la paginación
        db.find(consulta).skip(offset).limit(limit).exec((err, reports) => {
            if(err){
                res.sendStatus(500, "Internal Error");
            } else {
                res.send(JSON.stringify(reports.map((r) => {
                    delete r._id;
                    return r;
                })));
            }
        })
    });

    app.put(API_BASE, (req, res) => {
        res.sendStatus(405, "Method not Allowed"); //No se puede hacer un put a el array de recursos, se devuelve error 405
    });

    app.delete(API_BASE, (req, res) => {
        db.remove({}, { multi: true }, function (err, numRemoved) {
            if(err){
                res.sendStatus(500, "Internal Error");
            } else {
                res.sendStatus(200, "Deleted");
            }
        });
    });

    app.get(API_BASE + "/:country_name/:year", (req, res) => {
        const country = req.params.country_name;
        const year = parseInt(req.params.year);
        db.find({"country_name": country, "year": year}, (err, reports) => {
            if(err){
                res.sendStatus(500, "Internal Error");
            } else {
               let reportsData = reports.map((r) => {
                    delete r._id;
                    return r;
                });
                const countryData = reportsData.filter(r => r.country_name === country);
                if (countryData.length > 0) {
                    res.send(countryData[0]);
                } else {
                    res.sendStatus(404, "Not found");
                }
            }
        })
    });

    app.post(API_BASE + "/:country_name", (req, res) => {
        res.sendStatus(405, "Method not Allowed"); // No se puede hacer post a un recurso concreto
    });

    app.post(API_BASE + "/:country_name/:year", (req, res) => {
        res.sendStatus(405, "Method not Allowed"); // No se puede hacer post a un recurso concreto
    });

    app.put(API_BASE + "/:country_name/:year", (req, res) => {
        let body = req.body;
        const year = parseInt(req.params.year);
        let object_params = ["country_name","year","gdp","social_support","healthy_life_expectancy","generosity","possitive_affect","negative_affect"];
        const queryParams = Object.keys(body);
        const missingFields = object_params.filter(field => !queryParams.includes(field));

        if (missingFields.length > 0) {
            return res.status(400).send("Missing fields: " + missingFields.join(", "));
        } else if(queryParams.length !== 8) {
            return res.status(400).send("Incorrect fields size");
        } else if (year===body.year && req.params.country_name === body.country_name){
            db.update({"country_name": req.params.country_name, "year": year}, {$set: body}, (err,numUpdated) => {
                if (err) {
                    res.sendStatus(500, "Internal Error");
                }else{
                    if (numUpdated===0) {
                        res.sendStatus(404, "Not found");
                    } else {
                        res.sendStatus(200, "Ok");
                    }
                }
            });
        } else {
            return res.sendStatus(400).send("Body data and request params doesnt match");
        }
    });

    app.delete(API_BASE + "/:country_name/:year", (req, res) =>{
        const country = req.params.country_name;
        const year = parseInt(req.params.year);
        db.remove({"country_name": country, "year": year},{},(err,numRemoved)=>{

            if(err){
                res.sendStatus(500,"Internal Error");
            }else{
               if(numRemoved >= 1){
                    res.sendStatus(200,"Deleted");
               } else {
                    res.sendStatus(404,"Not found");
               }
            }
        });
    });

    app.use("/proxyCritics", function(req, res) {
        var url = "https://opencritic-api.p.rapidapi.com/game/hall-of-fame";
        var options = {
            url: url,
            headers: {
                'X-RapidAPI-Key': '70279dac2dmsh1a9b57adeb8f4e3p14fbddjsn7c8f8225b009',
                'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
            }
        };
        console.log('piped: ' + req.url);
        request(options, (error, response, body) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
                return;
            }
            console.log(response.statusCode);
            res.send(body);
        });
    });
    

};

export {loadBackendJMM};