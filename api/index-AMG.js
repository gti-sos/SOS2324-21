const API_BASE = '/api/v1/chocolate-ratings';
let resAMG = require('./index-AMG.js');

//var datos = resAMG.datos;

datos=[];

module.exports = (app) => {

    /*app.get(API_BASE+"/loadInitialData",(req,res)=>{
        if(data.lenght===0){
            data=[...datos]
            res.sendStatus(201, "Created")
        }else{
            res.send(JSON.stringify(data));
            res.sendStatus(200, "Ok");
        }

    });*/

    app.get(API_BASE + "/loadInitialData", (req, res) => {
        if (datos.length === 0){
            let data = [
                {
                    ref: 2454,
                    company_manufacture: "5150",
                    company_location: "U.S.A.",
                    review_date: 2019,
                    country_of_bean_origin: "Tanzania",
                    specific_bean_origin_or_bar_name: "Kokoa Kamili; batch 1",
                    cocoa_percent: 76,
                    ingredients: "3- B;S;C",
                    most_memorable_characteristics: "rich cocoa; fatty; bready",
                    rating: 3.25
                },
                {
                    ref: 2458,
                    company_manufacture: "5150",
                    company_location: "U.S.A.",
                    review_date: 2019,
                    country_of_bean_origin: "Dominican Republic",
                    specific_bean_origin_or_bar_name: "Zorzal; batch 1",
                    cocoa_percent: 76,
                    ingredients: "3- B;S;C",
                    most_memorable_characteristics: "cocoa; vegetal; savory",
                    rating: 3.5
                },
                {    
                    ref: 2454,
                    company_manufacture: "5150",
                    company_location: "U.S.A.",
                    review_date: 2019,
                    country_of_bean_origin: "Madagascar",
                    specific_bean_origin_or_bar_name: "Bejofo Estate; batch 1",
                    cocoa_percent: 76,
                    ingredients: "3- B;S;C",
                    most_memorable_characteristics: "cocoa; blackberry; full body",
                    rating: 3.75
                },
                {    
                    ref: 2542,
                    company_manufacture: "5150",
                    company_location: "U.S.A.",
                    review_date: 2021,
                    country_of_bean_origin: "Fiji",
                    specific_bean_origin_or_bar_name: "Matasawalevu; batch 1",
                    cocoa_percent: 68,
                    ingredients: "3- B;S;C",
                    most_memorable_characteristics: "chewy; off; rubbery",
                    rating: 3
                },
                {    
                    ref: 2546,
                    company_manufacture: "5150",
                    company_location: "U.S.A.",
                    review_date: 2021,
                    country_of_bean_origin: "Venezuela",
                    specific_bean_origin_or_bar_name: "Sur del Lago; batch 1",
                    cocoa_percent: 72,
                    ingredients: "3- B;S;C",
                    most_memorable_characteristics: "fatty; earthy; moss; nutty;chalky",
                    rating: 3
                },
                {    
                    ref: 2546,
                    company_manufacture: "5150",
                    company_location: "U.S.A.",
                    review_date: 2021,
                    country_of_bean_origin: "Uganda",
                    specific_bean_origin_or_bar_name: "Semuliki Forest; batch 1",
                    cocoa_percent: 80,
                    ingredients: "3- B;S;C",
                    most_memorable_characteristics: "mildly bitter; basic cocoa; fatty",
                    rating: 3.25
                },
                {    
                    ref: 2542,
                    company_manufacture: "5150",
                    company_location: "U.S.A.",
                    review_date: 2021,
                    country_of_bean_origin: "India",
                    specific_bean_origin_or_bar_name: "Anamalai; batch 1",
                    cocoa_percent: 68,
                    ingredients: "3- B;S;C",
                    most_memorable_characteristics: "milk brownie; macadamia;chewy",
                    rating: 3.5
                },
                {    
                    ref: 797,
                    company_manufacture: "A. Morin",
                    company_location: "France",
                    review_date: 2012,
                    country_of_bean_origin: "Bolivia",
                    specific_bean_origin_or_bar_name: "Bolivia",
                    cocoa_percent: 70,
                    ingredients: "4- B;S;C;L",
                    most_memorable_characteristics: "vegetal; nutty",
                    rating: 3.5
                },
                {    
                    ref: 797,
                    company_manufacture: "A. Morin",
                    company_location: "France",
                    review_date: 2012,
                    country_of_bean_origin: "Peru",
                    specific_bean_origin_or_bar_name: "Peru",
                    cocoa_percent: 63,
                    ingredients: "4- B;S;C;L",
                    most_memorable_characteristics: "fruity; melon; roasty",
                    rating: 3.75
                },
                {    
                    ref: 1011,
                    company_manufacture: "A. Morin",
                    company_location: "France",
                    review_date: 2013,
                    country_of_bean_origin: "Panama",
                    specific_bean_origin_or_bar_name: "Panama",
                    cocoa_percent: 70,
                    ingredients: "4- B;S;C;L",
                    most_memorable_characteristics: "brief fruit note; earthy; nutty",
                    rating: 2.75
                }
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

    app.get(API_BASE, (req, res) => {
        res.send(JSON.stringify(datos));
        res.sendStatus(200, "OK");
    });




}