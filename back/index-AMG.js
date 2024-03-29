const API_BASE = '/api/v1/chocolate-ratings';

var initialChocolate = [
    {ref: 2454, company_manufacture: "5150", company_location: "U.S.A.", review_date: 2019, country_of_bean_origin: "Tanzania", specific_bean_origin_or_bar_name: "Kokoa Kamili; batch 1", cocoa_percent: 76, ingredients: "3- B;S;C", most_memorable_characteristics: "rich cocoa; fatty; bready", rating: 3.25},
    {ref: 2458, company_manufacture: "5150", company_location: "U.S.A.", review_date: 2019, country_of_bean_origin: "Dominican Republic", specific_bean_origin_or_bar_name: "Zorzal; batch 1", cocoa_percent: 76, ingredients: "3- B;S;C", most_memorable_characteristics: "cocoa; vegetal; savory", rating: 3.5},
    {ref: 2454, company_manufacture: "5150", company_location: "U.S.A.", review_date: 2019, country_of_bean_origin: "Madagascar", specific_bean_origin_or_bar_name: "Bejofo Estate; batch 1", cocoa_percent: 76, ingredients: "3- B;S;C", most_memorable_characteristics: "cocoa; blackberry; full body", rating: 3.75},
    {ref: 2542, company_manufacture: "5150", company_location: "U.S.A.", review_date: 2021, country_of_bean_origin: "Fiji", specific_bean_origin_or_bar_name: "Matasawalevu; batch 1", cocoa_percent: 68, ingredients: "3- B;S;C", most_memorable_characteristics: "chewy; off; rubbery", rating: 3},
    {ref: 2546, company_manufacture: "5150", company_location: "U.S.A.", review_date: 2021, country_of_bean_origin: "Venezuela", specific_bean_origin_or_bar_name: "Sur del Lago; batch 1", cocoa_percent: 72, ingredients: "3- B;S;C", most_memorable_characteristics: "fatty; earthy; moss; nutty;chalky", rating: 3},
    {ref: 2546, company_manufacture: "5150", company_location: "U.S.A.", review_date: 2021, country_of_bean_origin: "Uganda", specific_bean_origin_or_bar_name: "Semuliki Forest; batch 1", cocoa_percent: 80, ingredients: "3- B;S;C", most_memorable_characteristics: "mildly bitter; basic cocoa; fatty", rating: 3.25},
    {ref: 2542, company_manufacture: "5150", company_location: "U.S.A.", review_date: 2021, country_of_bean_origin: "India", specific_bean_origin_or_bar_name: "Anamalai; batch 1", cocoa_percent: 68, ingredients: "3- B;S;C", most_memorable_characteristics: "milk brownie; macadamia;chewy", rating: 3.5},
    {ref: 797, company_manufacture: "A. Morin", company_location: "France", review_date: 2012, country_of_bean_origin: "Bolivia", specific_bean_origin_or_bar_name: "Bolivia", cocoa_percent: 70, ingredients: "4- B;S;C;L", most_memorable_characteristics: "vegetal; nutty", rating: 3.5},
    {ref: 797, company_manufacture: "A. Morin", company_location: "France", review_date: 2012, country_of_bean_origin: "Peru", specific_bean_origin_or_bar_name: "Peru", cocoa_percent: 63, ingredients: "4- B;S;C;L", most_memorable_characteristics: "fruity; melon; roasty", rating: 3.75},
    {ref: 1011, company_manufacture: "A. Morin", company_location: "France", review_date: 2013, country_of_bean_origin: "Panama", specific_bean_origin_or_bar_name: "Panama", cocoa_percent: 70, ingredients: "4- B;S;C;L", most_memorable_characteristics: "brief fruit note; earthy; nutty", rating: 2.75}
];

function api_AMG(app, db){
    app.get(API_BASE + "/loadInitialData", (req, res) => {

        const limit = parseInt(req.query.limit) || 10; // Comprueba si en la petición está el parámetro que indica cuántos elementos mostrar por página
        const offset = parseInt(req.query.offset) || 0; // Comprueba si en la petición está el parámetro que indica cuántos elementos saltarse

        db.find({}).skip(offset).limit(limit).exec((err,data) => {
            if(err){
                res.sendStatus(500, "Internal Server Error");
            }
            else{
                if(data.length === 0){
                    db.insert(initialChocolate);
                    res.sendStatus(201, "Data Created");
                }
                else{
                    res.send(JSON.stringify(data.map((d) => {
                        delete d._id;
                        return d;
                    })));
                }
            }
        });
    });

    // 1er POST
    app.post(API_BASE + "/", (req, res) => {
        let chocolate = req.body;
        let object_params = ["ref","company_manufacture", "company_location", "review_date", "country_of_bean_origin", "specific_bean_origin_or_bar_name", "cocoa_percent", "ingredients", "most_memorable_characteristics", "rating"];
        const queryParams = Object.keys(chocolate);
        const missingFields = object_params.filter(field => !queryParams.includes(field));
        if(missingFields.lenght > 0){
            return res.status(400).send("Missing fields: " + missingFields.join(", "));
        }
        else if(queryParams.length !== 10) {
            return res.status(400).send("Incorrect fields size");
        }
        else{
            db.find({}, (err,chocolates) => {
                if(err){
                    res.sendStatus(500, "Internal Error");
                }
                else{
                    if(chocolates.some(c => c.ref === chocolate.ref && c.specific_bean_origin_or_bar_name === chocolate.specific_bean_origin_or_bar_name)){
                        res.sendStatus(409, "Conflict");
                    }
                    else{
                        bd.insert(chocolate);
                        res.sendStatus(201,"Data Created")
                    }
                }
            })
        }
    });

    //1er Get
    app.get(API_BASE + "/", (req, res) =>{
        // Paginación
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        let object_params = ["ref","company_manufacture", "company_location", "review_date", "country_of_bean_origin", "specific_bean_origin_or_bar_name", "cocoa_percent", "ingredients", "most_memorable_characteristics", "rating"];

        const consulta = {};

        for (let key in req.query){
            if(key!="limit" && key!="offset"){
                if(!object_params.includes(key)){
                    return res.status(400).json({error: `El campos '${key}' no es válido`});
                }
                consulta[key] = isNaN(req.query[key]) ? new RegExp(req.query[key], 'i') : parseFloat(req.query[key]);
            }
        }

        db.find(consulta).skip(offset).limit(limit).exec((err, chocolates) => {
            if(err){
                res.sendStatus(500, "Internal Sever Error");
            }
            else{
                res.send(JSON.stringify(chocolates.map((c) => {
                    delete c._id;
                    return c;
                })));
            }
        });
    });

    //1er PUT
    app.put(API_BASE + "/", (req,res) => {
        //Solo se puede hacer un put de un recurso concreto, no de todos.
        res.sendStatus(405, "Method not Allowed");
    });

    app.delete(API_BASE + "/", (req,res) => {
        db.remove({}, { multi : true }, function(err, numRemoved){
            if(err){
                res.sendStatus(500, "Internal Server Error");
            }
            else{
                res.sendStatus(200, "Ok");
            }
        });
    });

    //2º POST
    app.post(API_BASE + "/", (req,res) => {
        //No está permitido hacer un post de un recurso concreto
        res.sendStatus(405, "Method Not Allowed")
    });

    //2º GET
    app.get(API_BASE + "/:company_manufacture", (req,res) => {
        //Devuelve los datos de una compañia concreta
        const comp = req.params.company_manufacture;
        db.find({}, (err,chocolates) => {
            if(err){
                res.sendStatus(500, "Internal Server Error");
            }
            else{
                chocolateData = chocolates.map((c) => {
                    delete c._id;
                    return c;
                })
                const compData = chocolateData.filter(c => c.company_manufacture === comp);
                if(compData.length > 0){
                    res.send(compData);
                }
                else{
                    res.sendStatus(404, "Not Found")
                }
            }
        });
    });

    //2º PUT
    app.put(API_BASE + "/:company_manufacture", (req,res) => {
        //Actualiza un recurso en concreto
        let body = req.body;
        let object_params = ["ref","company_manufacture", "company_location", "review_date", "country_of_bean_origin", "specific_bean_origin_or_bar_name", "cocoa_percent", "ingredients", "most_memorable_characteristics", "rating"]; 
        const queryParams = Object.keys(body);
        const missingFields = object_params.filter(field => !queryParams.includes(field));
        if(missingFields.length > 0){
            return res.status(400).send("Missing fields: " + missingFields.join(", "));
        }
        else if(queryParams.length !== 8) {
            return res.status(400).send("Incorrect fields size");
        }
        else{
            db.update({"company_manufacture": req.params.company_manufacture}, {$set:body}, (err,numUpdated) => {
                if(err){
                    res.sendStatus(500, "Internal Server Error");
                }
                else{
                    if(numUpdated===0){
                        res.sendStatus(404, "Not Found");
                    }
                    else{
                        res.sendStatus(200, "OK");
                    }
                }
            });
        }
    });

    //2º DELETE
    app.delete(API_BASE + "/:company_manufacture", (req, res) => {
        //Comprueba si un recurso concreto existe y en caso de ser asi, lo borra
        const comp = req.params.company_manufacture;
        db.remove({"company_manufacture": comp}, {}, (err, numRemoved) => {
            if(err){
                res.sendStatus(500, "Internal Server Error");
            }
            else{
                if(numRemoved >=1){
                    res.sendStatus(200, "Deleted");
                }
                else{
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });
};

export {api_AMG};