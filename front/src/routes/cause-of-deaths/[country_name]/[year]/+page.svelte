<script>
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { Input, Button, Alert } from '@sveltestrap/sveltestrap';

	let country_name = $page.params.country_name;
	let year = $page.params.year;

	let API = '/api/v2/cause-of-deaths';
	if (dev) {
		API = 'http://localhost:10000/api/v2/cause-of-deaths';
	}

	let reportToEdit = {};

	let errorMsg = '';
	let successMessage = '';


	async function loadReport() {
		try {
			let response = await fetch(`${API}/${country_name}/${year}`, {
				method: 'GET'
			});
			if (response.status == 200) {
				let data = await response.json();
				reportToEdit = data;
				console.log(reportToEdit);
			} else {
				console.error('Error cargando el informe:', response.statusText);
			}
		} catch (error) {
			console.error('Error cargando el informe:', error);
		}
	}
	loadReport();

	async function editReport() {
		try {
			let response = await fetch(`${API}/${country_name}/${year}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(reportToEdit)
			});
			if (response.status == 200) {
				console.log('Informe editado exitosamente');
				successMessage = 'Informe editado exitosamente';
				//window.location.reload();
				setTimeout(() => {
					successMessage = '';
					errorMsg = '';
					color_alert = '';
				}, 3200);
			} else {
				errorMsg = 'Error editando el informe: ' + response.statusText;
			}
		} catch (error) {
			errorMsg = error;
		}
	}
	/*
	onMount(async () => {
		await loadReport();
	});*/

	function parseMeningitis(value) {
		return parseInt(value);
	}

	function parseAlzheimer(value) {
		return parseInt(value);
	}

	function parseParkinson(value) {
		return parseInt(value);
	}
	function parseNutricionalDeficience(value) {
		return parseInt(value);
	}
	function parseMalaria(value) {
		return parseInt(value);
	}
</script>

<div class="listItem mx-auto mt-5" style="width: 60%;">
	<h2 class="title">Datos de {country_name} - {year}</h2>
	<p></p>
	<p>Código: {reportToEdit.code}</p>
	<p>
		Meningitis: <Input
			type="number"
			value={reportToEdit.meningitis}
			on:input={(event) => (reportToEdit.meningitis = parseMeningitis(event.target.value))}
		/>
	</p>
	<p>
		Alzheimer: <Input
			type="number"
			value={reportToEdit.alzheimer}
			on:input={(event) => (reportToEdit.alzheimer = parseAlzheimer(event.target.value))}
		/>
	</p>
	<p>
		Parkinson: <Input
			type="number"
			value={reportToEdit.parkinson}
			on:input={(event) => (reportToEdit.parkinson = parseParkinson(event.target.value))}
		/>
	</p>
	<p>
		Deficiencia Nutricional: <Input
			type="number"
			bind:value={reportToEdit.nutricional_deficiencie}
		/>
	</p>
	<p>
		Malaria: <Input
			type="number"
			value={reportToEdit.malaria}
			on:input={(event) => (reportToEdit.malaria = parseMalaria(event.target.value))}
		/>
	</p>

	<div class="button-center">
		<Button color="primary" outline on:click={editReport} class="save-button">Guardar</Button>
		<a href="/cause-of-deaths" class="button-margin-left">
			<Button color="secondary" outline>Volver al Inicio</Button>
		</a>
	</div>
	<p></p>
	{#if successMessage}
		<Alert color="info">{successMessage}</Alert>
	{/if}
	{#if errorMsg}
		<Alert color="danger">{errorMsg}</Alert>
	{/if}
</div>

<style>
	.title {
		color: #333;
		font-size: 24px;
		text-align: center;
	}

	.button-center {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}

	.button-margin-left {
		margin-left: 1rem;
	}
</style>
