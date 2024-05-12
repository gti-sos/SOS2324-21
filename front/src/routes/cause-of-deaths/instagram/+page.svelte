<script>
	import { onMount } from 'svelte';
	import { Row, Col, Table } from '@sveltestrap/sveltestrap';

	let followerData = [];
	let followedData = [];

	async function getUsers() {
		const url = 'https://instagram-scraper-api2.p.rapidapi.com/v1/search_users';
		const options = {
			method: 'GET',
			headers: {
				'x-rapidapi-key': 'c6210f1dcemshdd22246f52fc6f3p1a3adbjsn2897f732806f',
				'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
				'Content-Type': 'application/json'
			}
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();
			//console.log('Usuarios:', result);
		} catch (error) {
			console.error('Error fetching users:', error);
		}
	}

	async function getInstagramFollowers(username) {
		const url =
			'https://instagram-scraper-api2.p.rapidapi.com/v1/followers?username_or_id_or_url=' +
			username;
		const options = {
			method: 'GET',
			headers: {
				'x-rapidapi-key': 'c6210f1dcemshdd22246f52fc6f3p1a3adbjsn2897f732806f',
				'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
				'Content-Type': 'application/json'
			}
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();

			if (result.error) {
				console.error(`Error fetching followers for ${username}:`, result.error);
				return { username: username, followers: 'Error fetching followers' };
			}

			const followersCount = result.data.total;

			return { username: username, followers: followersCount };
		} catch (error) {
			console.error(`Error fetching followers for ${username}:`, error);
			return { username: username, followers: 'Error fetching followers' };
		}
	}

	async function getInstagramFollowing(username) {
		const url =
			'https://instagram-scraper-api2.p.rapidapi.com/v1/following?username_or_id_or_url=' +
			username;
		const options = {
			method: 'GET',
			headers: {
				'x-rapidapi-key': 'c6210f1dcemshdd22246f52fc6f3p1a3adbjsn2897f732806f',
				'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
				'Content-Type': 'application/json'
			}
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();

			// Verificamos si hay un error en la respuesta
			if (result.error) {
				console.error(`Error fetching followers for ${username}:`, result.error);
				return { username: username, followed: 'Error fetching followed' };
			}
			// Tomamos los datos de los seguidores si están disponibles
			const followingCount = result.data.total;

			return { username: username, followed: followingCount };
		} catch (error) {
			console.error(`Error fetching followed for ${username}:`, error);
			return { username: username, followed: 'Error fetching followed' };
		}
	}

	async function prepareData() {
		const users = ['justinbieber', 'katyperry', 'shakira', 'shawnmendes', 'alejandrosanz']; // Agrega los nombres de usuario que desees

		try {
			const followersData = await Promise.all(users.map(getInstagramFollowers));
			followerData = followersData;
			console.log('Follower data:', followerData);

			// Organiza los datos para el gráfico
			const chartData = followerData.map((user) => ({
				name: user.username,
				y: user.followers
			}));

			createChart(chartData);
		} catch (error) {
			console.error('Error fetching followers data:', error);
		}
	}

	function createChart(data) {
		Highcharts.chart('container', {
			chart: {
				type: 'pie',
				options3d: {
					enabled: true,
					alpha: 45
				}
			},
			title: {
				text: 'Seguidores por usuario'
			},
			subtitle: {
				text: 'Gráfico de donut en 3D'
			},
			plotOptions: {
				pie: {
					innerSize: '100',
					depth: 45
				}
			},
			series: [
				{
					name: 'Seguidores',
					data: data
				}
			]
		});
	}
	onMount(async () => {
		//await getUsers();
		await prepareData();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
	<script src="https://code.highcharts.com/modules/series-label.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
</svelte:head>

<Row>
	<Col>
		<div class="column-container">
			<Row class="justify-content-center">
				<Col sm="3" class="d-flex justify-content-end align-items-center">
					<img
						src="../../instagram.png"
						alt="Logo Shazam"
						width="40"
						height="40"
						style="margin-right: 10px;"
					/>
				</Col>
				<Col sm="9" class="d-flex align-items-center">
					<h2 class="title-text">
						Datos obtenidos de una API pública de Instagram
                        <!-- <a
							class="title-link"
							href="https://rapidapi.com/apidojo/api/shazam"
							target="_blank">https://rapidapi.com/apidojo/api/shazam</a
						> -->
					</h2>
				</Col>
			</Row>

			<div id="container" style="width:90%; height:400px; margin: 0 auto;"></div>
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
