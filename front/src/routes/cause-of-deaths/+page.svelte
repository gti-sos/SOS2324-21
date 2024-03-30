<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Button, Col, Row } from '@sveltestrap/sveltestrap';

	let API = '/api/v1/cause-of-deaths';

	if (dev) {
		API = 'http://localhost:10000/api/v1/cause-of-deaths';
	}

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

	let errorMsg = '';

	onMount(() => {
		getAPI();
	});

	async function getAPI() {
		try {
			let response = await fetch(API, {
				method: 'GET'
			});
			let data = await response.json();
			reports = data;
			console.log(data);
		} catch (e) {
			errorMsg = e;
		}
	}

	/*
	async function reloadAllData() {
    try {
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(initialReports)
        });

        if (response.status === 201) {
            console.log("Data reloaded successfully");
            // Realizar alguna acción adicional si es necesario
        } else {
            console.error("Error reloading data:", response.statusText);
        }
    } catch (error) {
        console.error("Error reloading data:", error.message);
    }
}*/

	/*<div><Button color="success" outline on:click={reloadAllData}>Reload</Button>
	</div>*/

	async function deleteAllReports() {
		try {
			let response = await fetch(API, { method: 'DELETE' });
			if (response.status == 200) {
				reports = [];
			} else {
				errorMsg = 'Error deleting all reports, code: ' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	function confirmDelete() {
		if (confirm('Are you sure you want to delete all reports?')) {
			deleteAllReports();
		}
	}

	async function deleteReport(n) {
		console.log(`Deleting report with name ${n}`);

		try {
			let response = await fetch(API + '/' + n, {
				method: 'DELETE'
			});
			if (response.status == 200) {
				getAPI();
			} else errorMsg = 'Error, code: ' + response.status;
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
			} else errorMsg = 'Error creating new death, code: ' + status;
		} catch (e) {
			console.log(e);
			errorMsg = 'Error creating new death, code: ' + status;
		}
	}
</script>

<Row>
	<Col sm="6">
		<div class="api-section d-flex flex-column justify-content-end">
			<h2>Data from API</h2>
			<ul>
				{#each reports as r}
					<li class="py-1">
						<div class="d-flex justify-content-between align-items-center">
							<div>
								<a href="/cause-of-deaths/{r.country_name}">{r.country_name}</a> - {r.code}
							</div>
							<div class="edits">
								<Button
									color="danger"
									outline
									size="sm"
									on:click={() => deleteReport(r.country_name)}>Delete</Button
								>
								&nbsp;
								<a href="/cause-of-deaths/{r.country_name}"
									><Button color="success" outline size="sm">Edit</Button></a
								>
							</div>
						</div>
					</li>
				{/each}
			</ul>
			<div class="d-flex justify-content-between">
				<div>
					<Button color="danger" outline on:click={confirmDelete}>Delete All Reports</Button>
				</div>
			</div>
		</div>
	</Col>

	<Col sm="6">
		<div class="create-section">
			<h2>Create New Report</h2>
			<table>
				<tbody>
					<tr>
						<td class="py-1">Name Country:</td>
						<td class="py-1"><input bind:value={newDeath.country_name} /></td>
					</tr>
					<tr>
						<td class="py-1">Code:</td>
						<td class="py-1"><input bind:value={newDeath.code} /></td>
					</tr>
					<tr>
						<td class="py-1">Year:</td>
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
						<td class="py-1">Nutricional Deficiencie:</td>
						<td class="py-1"><input bind:value={newDeath.nutricional_deficiencie} /></td>
					</tr>
					<tr>
						<td class="py-1">Malaria:</td>
						<td class="py-1"><input bind:value={newDeath.malaria} /></td>
					</tr>
				</tbody>
			</table>
			<div class="centered-button">
				<Button color="primary" outline on:click={createReport}>Create</Button>
			</div>
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
