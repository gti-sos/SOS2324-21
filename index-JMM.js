// Inicializa un array con los datos de ejemplo pestaña individual de la ficha de trabajo.

let my_data = [
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

// Algoritmo de medias

const field = "year";
const country = "Afghanistan";

function meanOfFieldFromCountry(data, field, country){
    let filteredData = data.filter(
        (obj) => obj.country_name === country
    );
    let res = 0;
    filteredData.forEach(o => { 
        res += o[field]    
    });
    return res/filteredData.length;
}

console.log("El resultado es: " + meanOfFieldFromCountry(my_data, field, country));
