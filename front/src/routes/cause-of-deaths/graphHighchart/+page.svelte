<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://code.highcharts.com/modules/series-label.js"></script>
</svelte:head>

<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Button, Row, Col } from '@sveltestrap/sveltestrap';

	//const DATAAPI = 'http://localhost:10000/api/v2/cause-of-deaths';

	let DATAAPI = '/api/v2/cause-of-deaths';

	if (dev) {
		DATAAPI = 'http://localhost:10000/api/v2/cause-of-deaths';
	}

	let columnData = [];
	let pieData = [];

	onMount(async () => {
		await getData();
	});

	async function getData() {
		try {
			let allData = [];
			let page = 1;
			let limit = 10; // Cantidad de datos a recuperar por página

			while (true) {
				const res = await fetch(`${DATAAPI}?limit=${limit}&offset=${(page - 1) * limit}`);
				const data = await res.json();

				if (data.length === 0) {
					break; // No hay más datos, salir del bucle
				}

				allData = allData.concat(data);
				page++;
			}

			//console.log(`All data received: ${JSON.stringify(allData, null, 2)}'`);
			columnData = allData;
			pieData = allData;
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	function filterColumnData(data, selectedCountry) {
		const filteredData = data.filter((item) => item.country_name === selectedCountry);
		const transformedData = filteredData.map((item) => ({
			country_name: item.country_name,
			year: item.year,
			meningitis: item.meningitis,
			alzheimer: item.alzheimer,
			parkinson: item.parkinson,
			nutricional_deficiencie: item.nutricional_deficiencie,
			malaria: item.malaria
		}));
        transformedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
		columnChart(transformedData, selectedCountry);
	}

	function columnChart(data, selectedCountry) {
		Highcharts.chart('chart-container', {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Enfermedades por año en el país ' + selectedCountry,
				align: 'center'
			},
			subtitle: {
				text: 'Source: Data API',
				align: 'left'
			},
			xAxis: {
				categories: data.map((item) => item.year),
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
				{ name: 'Meningitis', data: data.map((item) => item.meningitis) },
				{ name: 'Alzheimer', data: data.map((item) => item.alzheimer) },
				{ name: 'Parkinson', data: data.map((item) => item.parkinson) },
				{ name: 'Nutricional Deficiencie', data: data.map((item) => item.nutricional_deficiencie) },
				{ name: 'Malaria', data: data.map((item) => item.malaria) }
			],
			accessibility: {
				enabled: true 
			}
		});
	}

    function filterPieData(data, selectedCountry) {
    // Filtrar los datos solo para el país seleccionado
		const filteredData = data.filter((item) => item.country_name === selectedCountry);

		if (filteredData.length === 0) {
			console.error('No se encontraron datos para el país seleccionado.');
			return;
		}

		// Calcular la suma total de muertes por enfermedad en todos los años
		const totalData = filteredData.reduce(
			(total, item) => {
				return {
					meningitis: total.meningitis + item.meningitis,
					alzheimer: total.alzheimer + item.alzheimer,
					parkinson: total.parkinson + item.parkinson,
					nutricional_deficiencie: total.nutricional_deficiencie + item.nutricional_deficiencie,
					malaria: total.malaria + item.malaria
				};
			},
			{ meningitis: 0, alzheimer: 0, parkinson: 0, nutricional_deficiencie: 0, malaria: 0 }
    	);

		// Calcular los porcentajes de muertes por enfermedad
		const totalDeaths = Object.values(totalData).reduce((total, value) => total + value, 0);
		const percentagesData = Object.keys(totalData).reduce((result, key) => {
			result[key] = (totalData[key] / totalDeaths) * 100;
			return result;
		}, {});

    	pieChart(percentagesData, selectedCountry);
	}

	function pieChart(data, selectedCountry) {
		if (!document.getElementById('container')) return; // Verifica si el contenedor existe
		Highcharts.chart('container', {
			chart: {
				type: 'pie'
			},
			title: {
				text: 'Porcentaje de enfermedades a lo largo de los años en ' + selectedCountry
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			series: [
				{
					name: 'Enfermedades',
					data: Object.keys(data).map((key) => ({ name: key, y: data[key] }))
				}
			]
		});
	}
</script>



<Row>
	<Col>
		<div class="column-container">
			<h3 class="text-center">Gráficos API - Cause of Deaths</h3>
			<div class="button-center">
				<Button class="m-1" color="primary" on:click={filterColumnData(columnData, 'United States')}
					>Gráfico de Columnas</Button
				>
				<Button class="m-1" color="primary" on:click={filterPieData(pieData, 'Germany')}
					>Gráfico de Tarta</Button
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
		border-radius: 10px; 
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
		padding: 2rem; 
		background-color: white; 
		margin: 2rem;
		display: flex;
		flex-direction: column;
	}
	.button-center {
		display: flex;
		justify-content: center;
	}
</style>
