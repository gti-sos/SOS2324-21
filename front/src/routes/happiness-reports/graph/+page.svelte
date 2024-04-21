<svelte:head>
        <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>

    import {onMount} from "svelte";
    import { dev } from "$app/environment";


    let API = "/api/v1/happiness-reports";
    if(dev)
        API = "http://localhost:10000"+API;

    onMount(() => {
        getData();
    })

    // Variables de paginación
    let limit = 10; // Número de elementos por página
    let offset = 0; // Desplazamiento inicial

    // Llama a la función getReports con los parámetros de paginación
    async function getData(){
        try{
            const res = await fetch(API);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data,null,2)}'`);
            fillChart(data.map((o)=> o.gdp)); 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }
    async function fillChart(d){
        const chart = Highcharts.chart('container', {
                            chart: {
                                type: 'line'
                            },
                            title: {
                                text: 'Happiness Reports Data'
                            },
                            yAxis: {
                                title: {
                                    text: 'GDP'
                                }
                            },
                            plotOptions: {
                                line: {
                                    dataLabels: {
                                        enabled: true
                                    },
                                    enableMouseTracking: false
                                }
                            },
                            series: [{
                                name: 'Years',
                                data: d}
                            ]
                        });

    }  

</script>


<div id="container" style="width:100%; height:400px;"></div>