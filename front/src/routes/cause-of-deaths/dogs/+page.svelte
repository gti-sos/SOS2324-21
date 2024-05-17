<script>
	import { onMount } from 'svelte';
	import { Row, Col } from '@sveltestrap/sveltestrap';

	let longevityData = [];
	let weightData = [];

	async function getDogs() {
		const url = 'https://dogapi.dog/api/v2/breeds';
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		try {
			const response = await fetch(url, options);
			const result = await response.text();
			//console.log(result);
		} catch (error) {
			console.error(error);
		}
	}

	async function getLongevityData() {
		const url = 'https://dogapi.dog/api/v2/breeds';
		try {
			const response = await fetch(url);
			const result = await response.json();

			if (!result.data) {
				console.error('Error fetching breed data:', result);
				return [];
			}

			const longevityData = [];

			result.data.forEach((breed) => {
				longevityData.push({
					name: breed.attributes.name,
					life: {
						min: breed.attributes.life.min,
						max: breed.attributes.life.max
					}
				});
			});

			return longevityData;
		} catch (error) {
			console.error('Error fetching longevity data:', error);
			return [];
		}
	}

	async function getWeightData() {
		const url = 'https://dogapi.dog/api/v2/breeds';
		try {
			const response = await fetch(url);
			const result = await response.json();

			if (!result.data) {
				console.error('Error fetching breed data:', result);
				return [];
			}

			const weightData = [];

			result.data.forEach((breed) => {
				weightData.push({
					name: breed.attributes.name,
					weight: {
						min: breed.attributes.male_weight.min,
						max: breed.attributes.male_weight.max
					}
				});
			});

			return weightData;
		} catch (error) {
			console.error('Error fetching weight data:', error);
			return [];
		}
	}

	 	

	function chartLongevityData(longevityData) {
		Highcharts.chart('container', {
			chart: {
				type: 'column',
				options3d: {
					enabled: true,
					alpha: 15,
					beta: 15,
					viewDistance: 30,
					depth: 50
				}
			},

			title: {
				text: 'Longevidad de razas de perros'
			},

			xAxis: {
				categories: longevityData.map((dog) => dog.name), // Cada raza como categoría en el eje x
				labels: {
					skew3d: true,
					style: {
						fontSize: '16px'
					},
					rotation: -45
				}
			},

			yAxis: {
				allowDecimals: false,
				min: 0,
				title: {
					text: 'Edad (años)',
					skew3d: true,
					style: {
						fontSize: '15px'
					}
				}
			},

			tooltip: {
				headerFormat: '<b>{point.key}</b><br>',
				pointFormat:
					'<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} años'
			},

			plotOptions: {
				column: {
					grouping: true,
					depth: 40
				}
			},
			colors: ['#ff7f50', '#800080'],
			series: [
				{
					name: 'Máximo',
					data: longevityData.map((dog) => dog.life.max),
					stack: 'Life Span'
				},
				{
					name: 'Mínimo',
					data: longevityData.map((dog) => dog.life.min),
					stack: 'Life Span'
				}
				// {
				//     name: 'Promedio',
				//     data: longevityData.map((dog) => (dog.life.max + dog.life.min) / 2),
				//     stack: 'Life Span'
				// }
			]
		});
	}

	function chartWeightData(weightData) {
		Highcharts.chart('container2', {
			chart: {
				type: 'column',
				options3d: {
					enabled: true,
					alpha: 15,
					beta: 15,
					viewDistance: 30,
					depth: 50
				}
			},

			title: {
				text: 'Pesos de razas de perros'
			},

			xAxis: {
				categories: weightData.map((dog) => dog.name), // Cada raza como categoría en el eje x
				labels: {
					skew3d: true,
					style: {
						fontSize: '16px'
					},
					rotation: -45
				}
			},

			yAxis: {
				allowDecimals: false,
				min: 0,
				title: {
					text: 'Peso (kg)',
					skew3d: true,
					style: {
						fontSize: '15px'
					}
				}
			},

			tooltip: {
				headerFormat: '<b>{point.key}</b><br>',
				pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} kg'
			},

			plotOptions: {
				column: {
					grouping: false,
					depth: 40
				}
			},
			colors: ['#2f7ed8', '#20b2aa'],
			series: [
				{
					name: 'Mínimo',
					data: weightData.map((dog) => dog.weight.min),
					stack: 'Weight'
				},
				{
					name: 'Máximo',
					data: weightData.map((dog) => dog.weight.max),
					stack: 'Weight'
				}
			]
		});
	}
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/dashboards.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
</svelte:head>

<Row>
	<Col>
		<div class="column-container">
			<Row style="margin-bottom: 1rem;">
				<Col>
					<h2 class="title-text">
						Datos obtenidos de la API pública: <a
							class="title-link"
							href="https://dogapi.dog/docs/api-v2"
							target="_blank">https://dogapi.dog/docs/api-v2</a
						>
					</h2>
				</Col>
			</Row>
			<Row>
				<Col sm="6">
					<div id="container" style="height: 500px;"></div>
				</Col>
				<Col sm="6">
					<div id="container2" style="height: 500px;"></div>
				</Col>
			</Row>
		</div>
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
    .title-link {
        margin-bottom: 1rem;
    }
	.title-text {
		text-align: center;
		font-size: 24px;
		font-weight: bold;
	}

	.title-link {
		color: #007bff;
		text-decoration: none;
	}
</style>
