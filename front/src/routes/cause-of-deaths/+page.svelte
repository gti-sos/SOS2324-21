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
			errorMsg = e;
		}
	}

	let inputCountry = '';
	let inputYear = '';
	let filtered = false;

	async function getReportsBySearch() {
		try {
			let url = `${API}/${inputCountry}`;
			if (!isNaN(inputYear)) {
				url += `/${inputYear}`;
			}
			url += `?limit=${limit}&offset=${offset}`;
			
			let response = await fetch(url, {
			method: 'GET'
			});
			filtered = true;
			if (response.ok) {
				let data = await response.json();
				reports = [data]; // Aquí la respuesta se envuelve en un arreglo porque el componente espera un arreglo de reportes
				errorMsg = ''; // Reiniciar el mensaje de error si la solicitud tiene éxito
			} else if (response.status === 404) {
				errorMsg = 'No se encontraron informes para el país y año especificados.';
			} else {
				errorMsg = `Error al obtener los informes: ${response.statusText}`;
			}
		} catch (e) {
			errorMsg = `Error al obtener los informes: ${e.message}`;
		}
	}

	async function refreshReports() {
		await getReports(); 
		inputCountry = '';
    	inputYear = '';
		filtered = false;
	}

	// Función para cambiar de página hacia adelante
	function nextPage() {
		offset += limit;
		getReports();
	}

	// Función para cambiar de página hacia atrás
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

	function confirmDelete() {
		if (confirm('¿Estás seguro de que quieres eliminar todos los reportes?')) {
			deleteAllReports();
			successMessage = `Todos los reportes se han borrado exitosamente`; // Mostrar mensaje de éxito
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
				successMessage = `Informe con el nombre ${n} borrado exitosamente`; // Mostrar mensaje de éxito
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
			successMessage = `El reporte se han eliminado correctamente`; // Mostrar mensaje de éxito
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


	function handleInputChange(event) {
		const { name, value } = event.target;
		if (name === 'country') {
			inputCountry = value;
		} else if (name === 'year') {
			inputYear = parseInt(value);
		}
	}

	
</script>

<Row>
	<Col sm="6">
		<div class="api-section d-flex flex-column justify-content-end">
			<h2>Datos de la API</h2>
			<div class="d-flex justify-content-between">
				<div>
					<Button color="primary" outline on:click={loadInitialData}>Cargar datos iniciales</Button>
				</div>
				<div style="margin-left: 10px;">
					<Button color="danger" outline on:click={confirmDelete}>Eliminar todos los reportes</Button>
				</div>
				<div class="mb-3" style="margin-left: 10px;">
					<Button color="success" outline on:click={searchVisibililty}>Búsqueda Personalizada</Button>
				</div>
			</div>
			{#if showSearch}
			<div class="search d-flex flex-column justify-content-center align-items-center" style="margin-top: 10px;">
				<Row class="mb-3">
						<Col>
							<Input type="text" name="country" bind:value={inputCountry} placeholder="Afghanistan" on:input={handleInputChange} />
						</Col>
						<Col>
							<Input type="text" name="year" bind:value={inputYear} placeholder="2002" on:input={handleInputChange} />
						</Col>
						<Col>
							<Button color="primary" outline on:click={getReportsBySearch}>Buscar</Button>
						</Col>
					</Row>
				</div>
			{/if}
			<p></p>
			<ul>
				{#each reports as r}
					<li class="py-1 reportItem">
						<div class="d-flex justify-content-between align-items-center">
							<div>
								<a href="/cause-of-deaths/{r.country_name}">{r.country_name}</a> - {r.code}
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
				<Button color="warning"  on:click={refreshReports}>
					<svg fill="none" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
						<path xmlns="http://www.w3.org/2000/svg" d="M17.7071 5.29289C18.0976 5.68342 18.0976 6.31658 17.7071 6.70711L12.4142 12L17.7071 17.2929C18.0976 17.6834 18.0976 18.3166 17.7071 18.7071C17.3166 19.0976 16.6834 19.0976 16.2929 18.7071L10.2929 12.7071C9.90237 12.3166 9.90237 11.6834 10.2929 11.2929L16.2929 5.29289C16.6834 4.90237 17.3166 4.90237 17.7071 5.29289ZM11.7071 5.29289C12.0976 5.68342 12.0976 6.31658 11.7071 6.70711L6.41421 12L11.7071 17.2929C12.0976 17.6834 12.0976 18.3166 11.7071 18.7071C11.3166 19.0976 10.6834 19.0976 10.2929 18.7071L4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929L10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289Z" fill="#0D0D0D"></path>
						</svg>Volver
				</Button>
			{/if}
		</div>
	</Col>

	<Col sm="6">
		<div class="create-section">
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
			<p></p>
			{#if successMessage}
				<Alert color="info">{successMessage}</Alert>
			{/if}
			{#if errorMsg}
				<Alert color="danger">{errorMsg}</Alert>
			{/if}
		</div>
	</Col>
</Row>

<style>
	h2 {
		font-size: 1.6em;
		margin-bottom: 0.6em;
	}
	.create-section {
		margin-top: 2em;
	}
	.api-section {
		margin-top: 2em;
		margin-left: 2em;
		align-items: center;
	}

	.create-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20px; /* Espacio inferior */
	}

	.centered-button {
		margin-top: 1em;
	}
	.edits {
		display: flex;
		margin-left: 2em;
	}
</style>
