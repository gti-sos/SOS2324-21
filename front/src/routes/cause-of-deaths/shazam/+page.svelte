<script>
	import { onMount } from 'svelte';
	import { Row, Col } from '@sveltestrap/sveltestrap';

	async function getArtists() {
		//justin, harry, shawn, ed, ariana
		const url = 'https://shazam.p.rapidapi.com/search?term=beyonce&locale=en-US&offset=0&limit=5';
		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '23082ec540msh459da470c9f460cp12e7a9jsnbe7f2292d416',
				'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
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

	async function getTopSongs(artistId) {
		const url = `https://shazam.p.rapidapi.com/artists/get-top-songs?id=${artistId}&l=en-US`;
		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '23082ec540msh459da470c9f460cp12e7a9jsnbe7f2292d416',
				'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
			}
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();
			//console.log('Top songs:', result);

			if (result.error) {
				console.error(`Error fetching top songs for artistId ${artistId}:`, result.error);
				return { artistId: artistId, topSongs: 'Error fetching top songs' };
			}

			const topSongsData = [];

			result.data.forEach((song) => {
				topSongsData.push({
					albumName: song.attributes.albumName,
					artistName: song.attributes.artistName,
					releaseDate: song.attributes.releaseDate
				});
			});

			//console.log('Top songs DATA:', topSongsData);
			return topSongsData;
		} catch (error) {
			console.error(`Error fetching top songs for artistId ${artistId}:`, error);
			return { artistId: artistId, topSongs: 'Error fetching top songs' };
		}
	}

	// Usando la función en el mismo contexto de tu código
	onMount(async () => {
		//justin bieber: 320569549, harry styles: 666324254, adele: 262836961, beyonce: 440936881
		const artistIds = [440936881];

		try {
			getArtists();
			const allTopSongsData = await Promise.all(artistIds.map(getTopSongs));
			console.log('Top songs data:', allTopSongsData);
			renderChart(allTopSongsData.flat());
		} catch (error) {
			console.error('Error fetching top songs data:', error);
		}
	});

	function renderChart(data) {
		// Obtener los años de lanzamiento y contar las canciones por año
		const songsByYear = {};
		data.forEach((song) => {
			const year = new Date(song.releaseDate).getFullYear();
			if (songsByYear[year]) {
				songsByYear[year]++;
			} else {
				songsByYear[year] = 1;
			}
		});

		// Crear las columnas para el gráfico
		const years = Object.keys(songsByYear).sort();
		const songCounts = years.map((year) => songsByYear[year]);

		// Obtener detalles de canciones por año
		const songDetailsByYear = {};
		data.forEach((song) => {
			const year = new Date(song.releaseDate).getFullYear();
			const songDetail = `${song.albumName} ( ${song.releaseDate} )`;
			if (songDetailsByYear[year]) {
				songDetailsByYear[year].push(songDetail);
			} else {
				songDetailsByYear[year] = [songDetail];
			}
		});

		const artistIds = [320569549, 666324254];

		// Generar la gráfica de Highcharts
		Highcharts.chart('container', {
			chart: {
				type: 'line'
			},
			title: {
				text: 'Canciones más exitosas de Beyoncé por año según Shazam'
			},
			xAxis: {
				categories: years.map(String),
				title: {
					text: 'Año de lanzamiento'
				}
			},
			yAxis: {
				title: {
					text: 'Número de canciones'
				}
			},
			tooltip: {
				formatter: function () {
					let tooltip = `<b>Detalles:</b><br>`;
					if (this.point.details && this.point.details.length > 0) {
						tooltip += '';
						this.point.details.forEach((song) => {
							tooltip += `- ${song}<br>`;
						});
					}
					return tooltip;
				}
			},
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true
					},
					enableMouseTracking: true
				}
			},
			series: [
				{
					name: '',
					data: years.map((year) => ({
						y: songsByYear[year],
						details: songDetailsByYear[year] || []
					})),
					marker: {
						symbol: 'star' 
					}, 
                    color: '#FF007F'
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
	<script src="https://code.highcharts.com/modules/series-label.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
</svelte:head>

<Row>
	<Col>
		<div class="column-container">
			<div id="container" style="width:90%; height:500px; margin: 0 auto;"></div>
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

	#container {
		padding: 1rem;
	}
</style>
