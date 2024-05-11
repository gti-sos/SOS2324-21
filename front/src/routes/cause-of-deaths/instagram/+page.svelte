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
                'X-RapidAPI-Key': '23082ec540msh459da470c9f460cp12e7a9jsnbe7f2292d416',
                'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log('Usuarios:', result);
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
				'X-RapidAPI-Key': '23082ec540msh459da470c9f460cp12e7a9jsnbe7f2292d416',
				'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
			}
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();

			// Verificamos si hay un error en la respuesta
			if (result.error) {
				console.error(`Error fetching followers for ${username}:`, result.error);
				return { username: username, followers: 'Error fetching followers' };
			}
			// Tomamos los datos de los seguidores si están disponibles
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
				'X-RapidAPI-Key': '23082ec540msh459da470c9f460cp12e7a9jsnbe7f2292d416',
				'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
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


	onMount(async () => {
        await getUsers();
		const users = ['justinbieber', 'katyperry', 'shakira', 'shawnmendes', 'alejandrosanz']; // Agrega los nombres de usuario que desees

		try {
			const followersData = await Promise.all(users.map(getInstagramFollowers));
            const followingData = await Promise.all(users.map(getInstagramFollowing));
			followerData = followersData;
            followedData = followingData;
			console.log('Follower data:', followerData);
            console.log('Followed data:', followedData);
		} catch (error) {
			console.error('Error fetching followers data:', error);

		}
	});
</script>

<Row class="mt-1">
    <Col sm="12">
        <div class="column-container d-flex flex-column">
            <Row class="align-items-center">
                <Col style="width: 10%; ">
                    <img src="../../logoInstagram.jpg" alt="Instagram logo" style="width: 100%; max-width: 40px; height: auto;" />
                </Col>
                <Col>
                    <h2>Instagram API</h2>
                </Col>
            </Row>
            
            <Table class="table table-bordered table-striped table-custom">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Seguidores</th>
                        <th>Seguidos</th>
                    </tr>
                </thead>
                <tbody>
                    {#each followerData as follower, i}
                        <tr>
                            <td>{follower.username}</td>
                            <td>{follower.followers}</td>
                            <td>{followedData[i].followed}</td>
                        </tr>
                    {/each}
                </tbody>
            </Table>
        </div>
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

    td {
        padding-bottom: 10px; /* Espacio entre filas */
    }

    h2 {
        font-size: 1.6em;
        margin-bottom: 0.6em;
    }
</style>
