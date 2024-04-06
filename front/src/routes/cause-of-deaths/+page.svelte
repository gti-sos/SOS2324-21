<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Button, Col, Row } from '@sveltestrap/sveltestrap';

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

    async function getReports() {
        try {
            let response = await fetch(`${API}?limit=${limit}&offset=${offset}`, {
                method: "GET"
            });

            let data = await response.json();
            reports = data;
        } catch (e) {
            errorMsg = e;
        }
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
				getAPI();
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
				getAPI();
				successMessage = 'Informe creado exitosamente';
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
	<Col sm="6">
		<div class="api-section d-flex flex-column justify-content-end">
			<h2>Datos de la API</h2>
			<div class="d-flex justify-content-between">
				<div>
					<Button color="primary" outline on:click={loadInitialData}>Cargar datos iniciales</Button>
				</div>
				<div style="margin-left: 10px;">
					<Button color="danger" outline on:click={confirmDelete}
						>Eliminar todos los reportes</Button
					>
				</div>
			</div>
			<p></p>
			<ul>
				{#each reports as r}
					<li class="py-1">
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
									on:click={() => deleteReport(r.country_name)}>Eliminar</Button
								>
							</div>
						</div>
					</li>
				{/each}
			</ul>
			<div class="pagination" style="margin-bottom: 20px;">
                <Button style="margin-right: 10px;" on:click={previousPage} disabled={offset === 0}>Anterior</Button>
                <Button on:click={nextPage} disabled={reports.length < limit}>Siguiente</Button>
            </div>
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
				<p>{successMessage}</p>
			{/if}
			{#if errorMsg}
				<p>{errorMsg}</p>
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
