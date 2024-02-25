
// 1) Creación de datos
let datos = [
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1990,
        meningitis: 2159,
        alzheimer: 1116,
        parkinson: 371,
        nutricional_deficiencie: 2087,
        malaria: 93
    }, 
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1991,
        meningitis: 2218,
        alzheimer: 1136,
        parkinson: 374,
        nutricional_deficiencie: 2153,
        malaria: 189
    }, 
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1992,
        meningitis: 2475,
        alzheimer: 1162,
        parkinson: 378,
        nutricional_deficiencie: 2441,
        malaria: 239
    }, 
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1993,
        meningitis: 2812,
        alzheimer: 1187,
        parkinson: 384,
        nutricional_deficiencie: 2837,
        malaria: 108
    }, 
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1994,
        meningitis: 3027,
        alzheimer: 1211,
        parkinson: 391,
        nutricional_deficiencie: 3081,
        malaria: 211
    }, 
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1995,
        meningitis: 3102,
        alzheimer: 1225,
        parkinson: 394,
        nutricional_deficiencie: 3131,
        malaria: 175
    }, 
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1996,
        meningitis: 3193,
        alzheimer: 1239,
        parkinson: 398,
        nutricional_deficiencie: 3175,
        malaria: 175
    }, 
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1997,
        meningitis: 3304,
        alzheimer: 1253,
        parkinson: 402,
        nutricional_deficiencie: 3250,
        malaria: 240
    }, 
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1998,
        meningitis: 3281,
        alzheimer: 1267,
        parkinson: 409,
        nutricional_deficiencie: 3193,
        malaria: 563
    }, 
    {
        country_name: "Afghanistan",
        code: "AFG",
        year: 1999,
        meningitis: 3200,
        alzheimer: 1281,
        parkinson: 409,
        nutricional_deficiencie: 3115,
        malaria: 468
    }
];


// 2) Funcion de filtrado

//const field = "country_name";
//const name = "Afghanistan";
//const disease = "meningitis";

function calcularMediaPorPais(datos, field, name, disease){
    //fltramos por el campo geografico -> country_name
    const datosFiltrados = datos.filter(dato => dato[field] === name);

    //verificar si hay datos
    if(datosFiltrados.length === 0){
        console.log(`No hay datos para el país ${name}`);
        return 0;
    }

    //extraer los valores y calcular media
    const valores = datosFiltrados.map(dato => dato[disease]);
    const sumaValores = valores.reduce((acum, valor) => acum + valor, 0);
    const media = sumaValores / valores.length;

    return (`La media de afectados por ${disease} para ${name} es: ${media}`)
    //console.log(`La media de afectados por ${disease} para ${name} es: ${media}`);
}

module.exports.media_por_pais = calcularMediaPorPais;
module.exports.datos_mrc = datos;

