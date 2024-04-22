<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/series-label.js"></script>
</svelte:head>

<script>
	import { onMount } from 'svelte';
	import { Button, Row, Col } from '@sveltestrap/sveltestrap';

	const API = 'http://localhost:10000/api/v1/happiness-reports';

	let Data = [];
	//let pieData = [];

	onMount(async () => {
		await getData();
	});

	async function getData() {
		try {
			let offset = 0;
			let limit = 10; // Cantidad de datos a recuperar por página

			const res = await fetch(`${API}?limit=${limit}&offset=${offset}`);
			const data = await res.json();

			//console.log(`All data received: ${JSON.stringify(data, null, 2)}'`);
			Data = data;
			//pieData = data;
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	function filterAreaData(data, selectedCountry) {
		const filteredData = data.filter((item) => item.country_name === selectedCountry);
		const transformedData = filteredData.map((item) => ({
			country_name: item.country_name,
			year: item.year,
			gdp: item.gdp,
			social_support: item.social_support,
			healthy_life_expectancy: item.healthy_life_expectancy,
			generosity: item.generosity,
			possitive_affect: item.possitive_affect,
            negative_affect: item.negative_affect
		}));
        transformedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
		areaChart(transformedData, selectedCountry);
	}

    function filterColumnData(data, selectedCountry) {
		const filteredData = data.filter((item) => item.country_name === selectedCountry);
		const transformedData = filteredData.map((item) => ({
			country_name: item.country_name,
			year: item.year,
			gdp: item.gdp,
			social_support: item.social_support,
			healthy_life_expectancy: item.healthy_life_expectancy,
			generosity: item.generosity,
			possitive_affect: item.possitive_affect,
            negative_affect: item.negative_affect
		}));
        transformedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
		columnChart(transformedData, selectedCountry);
	}

	function areaChart(data, selectedCountry) {
		Highcharts.chart('chart-container', {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: 'Afecto positivo y negativo de 2008 - 2017 en '+ selectedCountry,
        align: 'left'
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 120,
        y: 70,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
    xAxis: {
        plotBands: [{ // Highlight the two last years
            from: 2016,
            to: 2017,
            color: 'rgba(68, 170, 213, .2)'
        }]
	},
    yAxis: {
        title: {
            text: 'Affect Quantity'
        }
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            pointStart: 2008
        },
        areaspline: {
            fillOpacity: 0.5
        }
    },
    series: [{
        name: 'Possitive Affect',
        data: data.map((item) => item.possitive_affect)
    }, {
        name: 'Negative Affect',
        data: data.map((item) => item.negative_affect)
    }]
    });

	}

function columnChart(data, selectedCountry) {
    Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Gráfico de generosidad 2008-2017 en ' + selectedCountry
    },
    xAxis: {
        categories: data.map((item) => item.year)
    },
    yAxis: {
        title: {
            text: 'Generosity Value'
        }
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        column: {
            borderRadius: '25%'
        }
    },
    series: [{
        name: 'Generosidad',
        data: data.map((item) => item.generosity)
    }]
});
}
</script>



<Row>
	<Col>
		<div class="column-container">
			<h3 class="text-center">Gráficos API - Cause of Deaths</h3>
			<div class="button-center">
				<Button class="m-1" color="primary" on:click={filterAreaData(Data, 'Afghanistan')}
					>Gráfico de Area</Button
				>
				<Button class="m-1" color="primary" on:click={filterColumnData(Data, 'Afghanistan')}
					>Gráfico de Columnas</Button
				>
			</div>
		</div>
	</Col>
</Row>

<Row>
	<Col>
		<div id="chart-container" style="width:80%; height:500px; margin: 0 auto;"></div>
		<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
	</Col>
</Row>

<style>
	.column-container {
		border-radius: 10px; /* Esquinas redondeadas */
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Sombra */
		padding: 20px; /* Espacio interno */
		background-color: white; /* Color de fondo */
		margin: 20px;
		display: flex;
		flex-direction: column;
	}
	.button-center {
		display: flex;
		justify-content: center;
	}
</style>
