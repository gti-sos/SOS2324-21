<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Button, Col, Row, Input, Alert } from '@sveltestrap/sveltestrap';

	let API = '/api/v2/cause-of-deaths';

	if (dev) {
		API = 'http://localhost:10000/api/v2/cause-of-deaths';
	}

	onMount(() => {
		getReports();
	});

	let errorMsg = '';
	let successMessage = '';

	let reports = [];
	let newDeath = {
		country_name: 'Germany',
		code: 'GER',
		year: 1999,
		meningitis: 259,
		alzheimer: 1101,
		parkinson: 301,
		nutricional_deficiencie: 287,
		malaria: 23
	};

	let message = '';
	let color_alert;
	let result = '';
	let resultStatus = '';

	// Paginacion
	// Variables de paginación
	let limit = 10; // Número de elementos por página
	let offset = 0; // Desplazamiento inicial
	let showSearch = false; // Variable para controlar la visibilidad de la sección de búsqueda

	// Función para modificar la visibilidad de la sección de búsqueda
	function searchVisibililty() {
		showSearch = !showSearch;
	}
	async function getReports() {
		try {
			let response = await fetch(`${API}?limit=${limit}&offset=${offset}`, {
				method: 'GET'
			});

			let data = await response.json();
			reports = data;
		} catch (e) {
			errorMsg = `Error al obtener los informes`;
			console.log(e);
		}
	}

	let searchParams = {
		country_name: '',
		code: '',
		year: '',
		meningitis: '',
		alzheimer: '',
		parkinson: '',
		nutricional_deficiencie: '',
		malaria: ''
	};

	let filtered = false;

	async function getReportsBySearch() {
		try {
			let url = `${API}?`;
			let queryParams = [];

			// Construir los parámetros de consulta según los campos no vacíos en searchParams
			for (const key in searchParams) {
				if (searchParams[key]) {
					queryParams.push(`${key}=${searchParams[key]}`);
				}
			}

			if (queryParams.length > 0) {
				url += queryParams.join('&');
				url += `&limit=${limit}&offset=${offset}`;
			} else {
				url += `limit=${limit}&offset=${offset}`;
			}

			let response = await fetch(url, {
				method: 'GET'
			});

			filtered = true;
			if (response.ok) {
				let data = await response.json();
				reports = data; 
				successMessage = ''; 
				
				// Verificar si no se encontraron informes
				if (reports.length === 0) {
					errorMsg = 'No se encontraron informes para los criterios de búsqueda especificados.';
					console.log(errorMsg);
				} else {
					errorMsg = ''; // Limpiar el mensaje de error si se encontraron informes
				}
			} 
			else if (response.status === 404) {
				errorMsg = 'No se encontraron informes para los criterios de búsqueda especificados.';
				
			} else {
				errorMsg = `Error al obtener los informes: ${response.statusText}`;
			}
			} catch (e) {
				errorMsg = `Error al obtener los informes: ${e.message}`;
			}
			setTimeout(() => {
				errorMsg = '';
				color_alert = '';
			}, 3200);

	}

	async function refreshReports() {
		await getReports(); 
		for (const key in searchParams) {
			searchParams[key] = '';
		}
		filtered = false;
	}

	function handleInputChange(event) {
		const { name, value } = event.target;
		searchParams[name] = value;
	}

	function nextPage() {
		offset += limit;
		getReports();
	}

	function previousPage() {
		if (offset >= limit) {
			offset -= limit;
			getReports();
		}
	}

	async function loadInitialData() {
		resultStatus = result = '';
		const res = await fetch(API + '/loadInitialData', {
			method: 'GET'
		});
		const status = await res.status;
		resultStatus = status;
		if (status == 500) {
			message = 'Ha habido un error en la petición';
			color_alert = 'danger';
		}
		if (status == 201) {
			message = 'Datos iniciales cargados correctamente';
			color_alert = 'success';
			getReports();
		}
		if (status == 400) {
			message = 'Ya hay datos cargados';
			color_alert = 'danger';
		}
		setTimeout(() => {
			message = '';
			color_alert = '';
		}, 3200);
	}

	async function deleteAllReports() {
		try {
			let response = await fetch(API, { method: 'DELETE' });
			if (response.status == 200) {
				reports = [];
			} else {
				errorMsg = 'Error borrando todos los reportes, código: ' + response.status;
			}
			setTimeout(() => {
				errorMsg = '';
				color_alert = '';
			}, 3200);
		} catch (e) {
			errorMsg = e;
		}
	}

	


	async function deleteReport(n) {
		console.log(`Borrando el reporte con el nombre ${n}`);

		try {
			let response = await fetch(API + '/' + n, {
				method: 'DELETE'
			});
			if (response.status == 200) {
				getReports();
				successMessage = `Informe con el nombre ${n} borrado exitosamente`; 
			} else errorMsg = 'Error eliminando el reporte (código: ' + response.status + ')';
			setTimeout(() => {
				successMessage = '';
				errorMsg = '';
				color_alert = '';
			}, 3200);
		} catch (e) {
			errorMsg = e;
		}
	}
	function confirmDeleteOne(country_name) {
		if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
			deleteReport(country_name);
			successMessage = `El reporte se han eliminado correctamente`;
		}
	}

	async function createReport() {
		try {
			let response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newDeath, null, 2)
			});
			let status = await response.status;
			console.log(`Creation responde status ${status}`);
			if (status == 201) {
				getReports();
				successMessage = 'Informe creado exitosamente :)';
			}
			if (status == 400) {
				errorMsg = 'Hay que insertar datos o faltan campos';
				color_alert = 'danger';
			}
			if (status == 409) {
				errorMsg = 'El recurso ya existe';
				color_alert = 'danger';
			}
			setTimeout(() => {
				successMessage = '';
				errorMsg = '';
				color_alert = '';
			}, 3200);
		} catch (e) {
			console.log(e);
			errorMsg = 'Error crando nueva entrada, código: ' + status;
		}
	}

</script>

<Row>
	<Col sm="7">
		<div class="column-container d-flex flex-column ">
			
			<Row>
				<Col><h2>Datos de la API</h2></Col>
				<Col>
					{#if successMessage}
						<Alert color="info">{successMessage}</Alert>
					{/if}
					{#if errorMsg}
						<Alert color="danger">{errorMsg}</Alert>
					{/if}
				</Col>
			</Row>
			
			<div class="d-flex justify-content-between">
				<div>
					<Button color="primary" outline on:click={loadInitialData}>Cargar datos iniciales</Button>
				</div>
				<div style="margin-left: 10px;">
					<Button color="danger" outline on:click={deleteAllReports}>Eliminar todos los reportes</Button>
				</div>
				<div class="mb-3" style="margin-left: 10px;">
					<Button color="success" outline on:click={searchVisibililty}>Búsqueda Personalizada</Button>
				</div>
			</div>
			{#if showSearch}
			<div class="search-container">
				<div class="search d-flex flex-column justify-content-center align-items-center" style="margin-top: 10px;">
					<Row class="mb-3">
						<Col> País:
							<Input type="text" name="country_name" bind:value={searchParams.country_name} placeholder="Spain" on:input={handleInputChange} />
						</Col>
						<Col> Código:
							<Input type="text" name="code" bind:value={searchParams.code} placeholder="ESP" on:input={handleInputChange} />
						</Col>
						<Col> Año:
							<Input type="text" name="year" bind:value={searchParams.year} placeholder="2003" on:input={handleInputChange} />
						</Col>
						<Col> Meningitis:
							<Input type="text" name="meningitis" bind:value={searchParams.meningitis} placeholder="0" on:input={handleInputChange} />
						</Col>
						
					</Row>
					<Row>
						<Col> Alzheimer:
							<Input type="text" name="alzheimer" bind:value={searchParams.alzheimer} placeholder="0" on:input={handleInputChange} />
						</Col>
						<Col> Parkinson:
							<Input type="text" name="parkinson" bind:value={searchParams.parkinson} placeholder="0" on:input={handleInputChange} />
						</Col>
						<Col> Def. Nutrición:
							<Input type="text" name="nutricional_deficiencie" bind:value={searchParams.nutricional_deficiencie} placeholder="0" on:input={handleInputChange} />
						</Col>
						<Col> Malaria:
							<Input type="text" name="malaria" bind:value={searchParams.malaria} placeholder="0" on:input={handleInputChange} />
						</Col>
						
					</Row>
					<Row>
						<div class="mb-3" style="margin-top: 20px;">
							<Button color="primary" outline on:click={getReportsBySearch}>Buscar</Button>
						</div>
					</Row>
				</div>
			</div>
			{/if}
			<ul class="centered-list">
				{#each reports as r}
					<li class="py-1 list-item" id="list-item">
						<div class="d-flex justify-content-between align-items-center">
							<div>
								{r.country_name}- {r.code}
							</div>
							<div class="edits">
								<a href="/cause-of-deaths/{r.country_name}/{r.year}"
									><Button color="success" outline size="sm">Editar</Button></a
								>
								&nbsp;
								<Button
									color="danger"
									outline
									size="sm"
									on:click={() => confirmDeleteOne(r.country_name)}>Eliminar</Button
								>
							</div>
						</div>
					</li>
				{/each}
			</ul>
			<div class="pagination-container">
				<div class="pagination" style="margin-bottom: 20px;">
					<Button style="margin-right: 10px;" on:click={previousPage} disabled={offset === 0}>
						<svg fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path xmlns="http://www.w3.org/2000/svg" d="M14 17L8 12L14 7L14 17Z" fill="#0D0D0D"></path>
							</svg>Anterior</Button>
					<Button on:click={nextPage} disabled={reports.length < limit}>
						Siguiente
						<svg fill="white" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path xmlns="http://www.w3.org/2000/svg" d="M10 7L16 12L10 17L10 7Z" fill="#0D0D0D"></path>
							</svg></Button>
				</div>
				{#if filtered}
				<div style="text-align: center;">
					<Button color="warning"  on:click={refreshReports}>
						<svg fill="none" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
							<path xmlns="http://www.w3.org/2000/svg" d="M17.7071 5.29289C18.0976 5.68342 18.0976 6.31658 17.7071 6.70711L12.4142 12L17.7071 17.2929C18.0976 17.6834 18.0976 18.3166 17.7071 18.7071C17.3166 19.0976 16.6834 19.0976 16.2929 18.7071L10.2929 12.7071C9.90237 12.3166 9.90237 11.6834 10.2929 11.2929L16.2929 5.29289C16.6834 4.90237 17.3166 4.90237 17.7071 5.29289ZM11.7071 5.29289C12.0976 5.68342 12.0976 6.31658 11.7071 6.70711L6.41421 12L11.7071 17.2929C12.0976 17.6834 12.0976 18.3166 11.7071 18.7071C11.3166 19.0976 10.6834 19.0976 10.2929 18.7071L4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929L10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289Z" fill="#0D0D0D"></path>
							</svg>Volver
					</Button>
				</div>
				{/if}
			</div>
		</div>
	</Col>

	<Col sm="5">
		<div class="column-container-new">
			<h2>Crear un Reporte</h2>
			<table>
				<tbody>
					<tr>
						<td class="py-1">Nombre país:</td>
						<td class="py-1"><input bind:value={newDeath.country_name} /></td>
					</tr>
					<tr>
						<td class="py-1">Código:</td>
						<td class="py-1"><input bind:value={newDeath.code} /></td>
					</tr>
					<tr>
						<td class="py-1">Año:</td>
						<td class="py-1"><input bind:value={newDeath.year} /></td>
					</tr>
					<tr>
						<td class="py-1">Meningitis:</td>
						<td class="py-1"><input bind:value={newDeath.meningitis} /></td>
					</tr>
					<tr>
						<td class="py-1">Alzheimer:</td>
						<td class="py-1"><input bind:value={newDeath.alzheimer} /></td>
					</tr>
					<tr>
						<td class="py-1">Parkinson:</td>
						<td class="py-1"><input bind:value={newDeath.parkinson} /></td>
					</tr>
					<tr>
						<td class="py-1">Deficiencia Nutricional:</td>
						<td class="py-1"><input bind:value={newDeath.nutricional_deficiencie} /></td>
					</tr>
					<tr>
						<td class="py-1">Malaria:</td>
						<td class="py-1"><input bind:value={newDeath.malaria} /></td>
					</tr>
				</tbody>
			</table>
			<div class="centered-button">
				<Button color="primary" outline on:click={createReport}>Crear</Button>
			</div>
		</div>
	</Col>
</Row>

<style>
	.pagination-container {
		margin: 0 auto; /* Centrar horizontalmente */
		width: fit-content; /* Ajustar el ancho al contenido */
	}

	.search-container {
		background-color: rgba(129, 183, 231, 0.3); /* Color de fondo verde transparente */
		padding: 10px; /* Espacio interno */
		padding-left: 20px; /* Espacio interno izquierdo */
		padding-right: 20px; /* Espacio interno derecho */
		border-radius: 10px; /* Esquinas redondeadas */
		margin-top: 10px; /* Margen superior */
	}

	.search-container .search {
		width: 100%; /* Ajusta el ancho al 100% */
	}
	.centered-list {
		list-style-type: none; /* Quita los marcadores de lista */
		padding: 0; /* Elimina el relleno */
		text-align: center; /* Centra horizontalmente los elementos de la lista */
	}

	.centered-list li {
		margin: 5px; /* Espaciado entre elementos de la lista */
	}

	.column-container {
		border-radius: 10px; /* Esquinas redondeadas */
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Sombra */
		padding: 20px; /* Espacio interno */
		background-color: white; /* Color de fondo */
		margin: 20px;
		display: flex;
        flex-direction: column;
	}
	.column-container-new {
		border-radius: 10px; /* Esquinas redondeadas */
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Sombra */
		padding: 20px; /* Espacio interno */
		background-color: white; /* Color de fondo */
		margin: 20px;
		display: flex;
        flex-direction: column;
		align-items: center;
	}

    table {
        margin-top: 20px; /* Espacio entre la tabla y el título */
        text-align: left; /* Alinear texto a la izquierda */
    }
	td {
        padding-bottom: 10px; /* Espacio entre filas */
    }

    .py-1 {
        padding-right: 10px; /* Espacio entre texto y input */
    }

    .centered-button {
        margin-top: 20px; /* Espacio entre la tabla y el botón */
    }
	h2 {
		font-size: 1.6em;
		margin-bottom: 0.6em;
	}

	.centered-button {
		margin-top: 1em;
	}
	.edits {
		display: flex;
		margin-left: 2em;
	}
</style>
