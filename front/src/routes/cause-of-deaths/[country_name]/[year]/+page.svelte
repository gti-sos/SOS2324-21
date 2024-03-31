<script>
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { Input, Button } from '@sveltestrap/sveltestrap';


	let country_name = $page.params.country_name;
	let year = $page.params.year;

	let API = '/api/v1/cause-of-deaths';
	if (dev) {
		API = 'http://localhost:10000/api/v1/cause-of-deaths';
	}

	let reportToEdit = {
		country_name: country_name,
		year: year,
		code: '',
		meningitis: 0,
		alzheimer: 0,
		parkinson: 0,
		nutricional_deficiencie: 0,
		malaria: 0
	};

	let errorMsg = '';

	async function loadReport() {
		try {
			let response = await fetch(`${API}/${country_name}/${year}`);
			if (response.status == 200) {
				let data = await response.json();
				reportToEdit = { ...reportToEdit, ...data };
			} else {
				console.error('Error cargando el informe:', response.statusText);
			}
		} catch (error) {
			console.error('Error cargando el informe:', error);
		}
	}

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
				errorMsg = 'Informe editado exitosamente';
				await loadReport();
			} else {
				errorMsg = 'Error editando el informe: ' + response.statusText;
			}
		} catch (error) {
			errorMsg = error;
		}
	}

	onMount(async () => {
		await loadReport();
	});
</script>

<div class="container mx-auto mt-5" style="width: 60%;">
    <h2 class="title">Datos de {country_name} - {year}</h2>
    <p></p>
    <p>Código: {reportToEdit.code}</p>
    <p>Meningitis: <Input type="number" bind:value={reportToEdit.meningitis} /></p>
    <p>Alzheimer: <Input type="number" bind:value={reportToEdit.alzheimer} /></p>
    <p>Parkinson: <Input type="number" bind:value={reportToEdit.parkinson} /></p>
    <p>Deficiencia Nutricional: <Input type="number" bind:value={reportToEdit.nutricional_deficiencie} /></p>
    <p>Malaria: <Input type="number" bind:value={reportToEdit.malaria} /></p>

    <div class="button-center">
        <Button color="primary" outline on:click={editReport} class="save-button">
            Guardar
        </Button>
        <a href="/cause-of-deaths" class="button-margin-left">
            <Button color="secondary" outline>
                Volver al Inicio
            </Button>
        </a>
    </div>
    {#if errorMsg}
        <p>{errorMsg}</p>
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