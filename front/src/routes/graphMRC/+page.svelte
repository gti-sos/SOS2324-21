<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let initialReports = [];
    const DATAAPI = 'http://localhost:10000/api/v2/cause-of-deaths';

    async function getData() {
        try {
            const res = await fetch(DATAAPI);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data, null, 2)}'`);
            fillChart(data);
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    function fillChart(data) {
        const transformedData = data.map(item => ({
            country_name: item.country_name,
            year: item.year,
            meningitis: item.meningitis,
            alzheimer: item.alzheimer,
            parkinson: item.parkinson,
            nutricional_deficiencie: item.nutricional_deficiencie,
            malaria: item.malaria
        }));
        drawChart(transformedData);
    }

    function drawChart(data) {
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Enfermedades por año en ' + data[0].country_name,
                align: 'center'
            },
            subtitle: {
                text: 'Source: Data API',
                align: 'left'
            },
            xAxis: {
                categories: data.map(item => item.year),
                crosshair: true,
                accessibility: {
                    description: 'Years'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Cases'
                }
            },
            tooltip: {
                shared: true
            },
            series: [
                { name: 'Meningitis', data: data.map(item => item.meningitis) },
                { name: 'Alzheimer', data: data.map(item => item.alzheimer) },
                { name: 'Parkinson', data: data.map(item => item.parkinson) },
                { name: 'Nutricional Deficiencie', data: data.map(item => item.nutricional_deficiencie) },
                { name: 'Malaria', data: data.map(item => item.malaria) }
            ]
        });
    }

    onMount(getData);
</script>

<div id="container" style="width:100%; height:500px;"></div>
