<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Button } from '@sveltestrap/sveltestrap';

	let data = [];
	let data_food = [];
	let data_integracion = [];
	let result = '';

	let API_food_production = 'https://sos2324-20-415018.ew.r.appspot.com/api/v3/food-production';

	let API = '/api/v2/cause-of-deaths';
	if (dev) {
		API = 'http://localhost:10000' + API;
	}

	//let API = 'http://localhost:10000/api/v2/cause-of-deaths/proxy/?url=https://sos2324-20-415018.ew.r.appspot.com/api/v3/food-production';
	onMount(async () => {
		await loadChartData();
		//console.log(`Data received: ${JSON.stringify(data_integracion, null, 2)}`);
	});

	async function loadChartData() {
		await loadData();
		const chartData = prepareChartData(data_integracion);
		createChart(chartData);
	}

	async function loadFood() {
		await fetch(API_food_production + '/loadInitialData', {
			method: 'GET'
		});
		await loadData();
		//console.log(`Data received: ${JSON.stringify(data_integracion, null, 2)}`);
	}
	async function loadData() {
		await getData();
		await getData_food();
		await mixData(); // Llamada a mixData dentro de loadData
	}
	async function mixData() {
		// objeto con datos de mi API
		const causeOfDeathMap = {};
		data.forEach((item) => {
			const key = `${item.country_name}-${item.year}`;
			causeOfDeathMap[key] = item;
		});

		// objeto con datos de API - food production
		const foodProductionMap = {};
		data_food.forEach((item) => {
			const key = `${item.Entity}-${item.Year}`;
			foodProductionMap[key] = item;
		});

		// Iterar sobre los datos de producción de alimentos y combinar con los datos de causa de muerte
		const integratedData = [];
		Object.keys(causeOfDeathMap).forEach((key) => {
			const keyFood = key.replace('Eswatini', 'Eswatini').replace('-', '-');
			const item = causeOfDeathMap[key];
			const foodItem = foodProductionMap[keyFood];
			if (foodItem) {
				integratedData.push({
					country_name: item.country_name,
					year: item.year,
					nutricional_deficiencie: item.nutricional_deficiencie,
					Entity: foodItem.Entity,
					Year: foodItem.Year,
					potatoes_production: foodItem.potatoes_production,
					meat_chicken_production: foodItem.meat_chicken_production
				});
			}
		});

		console.log(`Integrated data: ${JSON.stringify(integratedData, null, 2)}`);

		data_integracion = integratedData;
	}

	async function getData() {
		const res = await fetch(API + '?country_name=Eswatini&limit=10000&offset=0', {
			method: 'GET'
		});

		try {
			const dataReceived = await res.json();
			const filteredData = dataReceived.filter((item) => {
				return item.year >= 2009 && item.year <= 2019;
			});
			result = JSON.stringify(filteredData, null, 2);
			data = filteredData;
			console.log(`Data: ${JSON.stringify(data, null, 2)}`);
		} catch (error) {
			console.log(error);
		}
	}

	async function getData_food() {
		const res = await fetch(API_food_production + '?Entity=Eswatini&limit=10000&offset=0', {
			method: 'GET'
		});

		try {
			const dataReceived = await res.json();
			const filteredData = dataReceived.filter((item) => {
				return item.Year >= 2009 && item.Year <= 2019;
			});
			result = JSON.stringify(filteredData, null, 2);
			data_food = filteredData;
			console.log(`Data food: ${JSON.stringify(data_food, null, 2)}`);
		} catch (error) {
			console.log(error);
		}
	}

	function prepareChartData(data) {
		const years = [...new Set(data.map((item) => item.year))];
		const deathByNutritionalDeficiency = years.map((year) => {
			const yearData = data.filter((item) => item.year === year);
			const deaths = yearData.reduce((acc, curr) => acc + curr.nutricional_deficiencie, 0);
			const potatoesProduction = yearData.reduce((acc, curr) => acc + curr.potatoes_production, 0);
			const chickenProduction = yearData.reduce(
				(acc, curr) => acc + curr.meat_chicken_production,
				0
			);
			const totalProduction = potatoesProduction + chickenProduction;
			return {
				year: year,
				deaths: deaths,
				totalProduction: totalProduction
			};
		});
		return deathByNutritionalDeficiency;
	}

	// GRÁFICA DE TIPO COMBINACION
	function createChart(data) {
		Highcharts.chart('container', {
			title: {
				text: 'Producción Total y Deficiencia Nutricional por Año en Eswatini',
				align: 'left'
			},
			xAxis: {
				categories: data.map((item) => item.year),
				title: {
					text: 'Año'
				}
			},
			yAxis: [
				{
					title: {
						text: 'Número de muertes por deficiencia nutricional'
					},
					opposite: false
				},
				{
					title: {
						text: 'Producción total'
					},
					opposite: true
				}
			],
			tooltip: {
				shared: true,
				valueSuffix: ''
			},
			plotOptions: {
				column: {
					borderRadius: '25%'
				}
			},
			series: [
				{
					type: 'column',
					name: 'Deficiencia Nutricional',
					data: data.map((item) => item.deaths),
					yAxis: 1
				},
				{
					type: 'column',
					name: 'Producción Total',
					data: data.map((item) => item.totalProduction),
					yAxis: 1
				},
				{
					type: 'line',
					name: 'Promedio',
					data: data.map((item) => (item.deaths + item.totalProduction) / 2),
					marker: {
						enabled: false
					}
				}
			]
		});
	}
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
	<h3>Gráfico de Producción Total y Deficiencia Nutricional por Año en Eswatini</h3>
	<div id="container" style="width: 100%; height: 400px;"></div>
	{#if data_integracion.length == 0}
		<Button on:click={loadFood} color="warning">Cargar datos</Button>
	{/if}
</main>
