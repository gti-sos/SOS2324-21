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

data=[];

module.exports = (app) => {

    app.get(API_BASE+"/loadInitialData", (req,res) => {
        if(data.length === 0) { //Si esta vacio, entonces crea los datos
            data = [...initialReports];
            res.sendStatus(201, "Data Created");
        } else {
            res.send(JSON.stringify(data));
            //res.sendStatus(200, "Ok");
        }
    });

    app.post(API_BASE, (req, res) => {
        let report = req.body;
        let object_params = ["country_name","year","gdp","social_support","healthy_life_expectancy","generosity","possitive_affect","negative_affect"];
        const queryParams = Object.keys(report);
        const missingFields = object_params.filter(field => !queryParams.includes(field));
        if (missingFields.length > 0) {
            return res.status(400).send("Missing fields: " + missingFields.join(", "));
        } else if(queryParams.length !== 8) {
            return res.sendStatus(400, "Incorrect fields size");
        } else {
            if(data.some(r => r.country_name === report.country_name && r.year=== report.year)) {
                res.sendStatus(409, "Conflict");
            } else{
                data.push(report);
                res.sendStatus(201, "Data Created");
            }
        }
    });

    app.get(API_BASE, (req, res) => {
        res.send(JSON.stringify(data));
        //res.sendStatus(200, "OK");
    });

    app.put(API_BASE, (req, res) => {
        res.sendStatus(405, "Method not Allowed"); //No se puede hacer un put a el array de recursos, se devuelve error 405
    });

    app.delete(API_BASE, (req, res) => {
        data = []; //Elimina todos los datos
        res.sendStatus(200, "Deleted");
    });

    app.get(API_BASE + "/:country_name", (req, res) => {
        const country = req.params.country_name;
        const countryData = data.filter(r => r.country_name === country);
        if (countryData.length > 0) {
            res.send(countryData);
        } else {
            res.sendStatus(404, "Not found");
        }
    });

    app.post(API_BASE + "/:country_name", (req, res) => {
        res.sendStatus(405, "Method not Allowed"); // No se puede hacer post a un recurso concreto
    });

    app.put(API_BASE + "/:country_name", (req, res) => {
        let body = req.body;
        let object_params = ["country_name","year","gdp","social_support","healthy_life_expectancy","generosity","possitive_affect","negative_affect"];
        const queryParams = Object.keys(body);
        const missingFields = object_params.filter(field => !queryParams.includes(field));
        if (missingFields.length > 0) {
            return res.status(400).send("Missing fields: " + missingFields.join(", "));
        } else if(queryParams.length !== 8) {
            return res.sendStatus(400, "Incorrect fields size");
        } else {
            
            if (data.filter(r => r.country_name === req.params.country_name).length === 0){ // Si no se encuentra el recurso, error 404
                res.sendStatus(404, "Not Found");
            } else { 
                for (let i = 0; i < data.length; i++){
                    if (data[i].country_name === req.params.country_name){
                        data[i] = body;
                    }
                }
                res.sendStatus(200, "OK");
            }
        }
    });

    app.delete(API_BASE + "/:country_name", (req, res) =>{
        const country = req.params.country_name;
        const dataLength = data.length;
        data = data.filter(r => r.country_name !== country);

        if (data.length < dataLength) {
            res.sendStatus(200, "Deleted");
        } else {
            res.sendStatus(404, "Not found");
        }
    });

};