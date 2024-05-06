<script>

    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Button, Col, Row } from '@sveltestrap/sveltestrap';
    import { navigate } from 'svelte-routing';


    let API = "/api/v1/happiness-reports";
    let reports = [];
    let errorMsg="";
    let newReport = {
        country_name: "Afghanistan",
        year: 2030,
        gdp: 7.697,
        social_support: 491,
        healthy_life_expectancy: 52.800,
        generosity: -121,
        possitive_affect: 496,
        negative_affect: 371
    };
    let successMessage = '';

    let searchParams = {
        country_name: "",
        year: "",
        gdp: "",
        social_support: "",
        healthy_life_expectancy: "",
        generosity: "",
        possitive_affect: "",
        negative_affect: ""
    };
    let searchResults = [];
    let searchErrorMsg = "";

    if(dev)
        API = "http://localhost:10000"+API;

    onMount(() => {
        getReports();
    })

    async function searchReports() {
        try {
            let queryString = Object.keys(searchParams)
                .filter(key => searchParams[key] !== "")
                .map(key => `${key}=${searchParams[key]}`)
                .join("&");

            let response = await fetch(`${API}?${queryString}`, {
                method: "GET"
            });

            if (response.ok) {
                let data = await response.json();
                searchResults = data;
                searchErrorMsg = "";
            } else {
                searchErrorMsg = `Error en la búsqueda: ${response.statusText}`;
            }
        } catch (e) {
            searchErrorMsg = `Error en la búsqueda: ${e.message}`;
        }
    }

    async function deleteReport(n, y){
        console.log(`Deleting Report with name ${n} and year ${y}`);

        try{
            let response =  await   fetch(API+"/"+n +"/"+y,{
                                        method: "DELETE"
                                    });
            
            if(response.status == 200){
                getReports();
                successMessage = `Informe borrado exitosamente`; // Mostrar mensaje de éxito
            } else if(response.status === 409) {
                alert("Esta persona esta duplicada")
            } else if (response.status === 400) {
                alert("Persona no encontrada")
            } else
                errorMsg = "code:"+response.status;
            
        }catch(e){
            errorMsg = e;
        } 
    } 

    function confirmDelete() {
		if (confirm('¿Seguro que quieres borrar todos los reportes?')) {
			deleteAllReports();
		}
	}

    async function loadInitialData() {
		if (confirm('¿Seguro que quiere cargar los reportes iniciales?')) {
			try {
                let response =  await fetch(`${API}/loadInitialData`);
                if(response.status == 200 || response.status == 201){
                    getReports();
                    successMessage = `Datos cargados exitosamente`; // Mostrar mensaje de éxito
                }
            } catch(e) {
                errorMsg = e;
            }
		}
	}

    async function deleteAllReports() {
		try {
			let response = await fetch(API, { method: 'DELETE' });
			if (response.status == 200) {
				reports = [];
                successMessage = `Informes borrados exitosamente`;

			} else if (response.status==404) {
                successMessage = `Informe no encontrado`;
            }else if (response.status==409) {
                successMessage = `Informe duplicado`;
            } else if (response.status==400) {
                successMessage = `Formato incorrecto`;
            } 
            
            else {
				errorMsg = 'Error deleting all reports, code: ' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}

    async function createReport(){

        try {
            let response = await fetch(API,{
                method: "POST",
                headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newReport, null, 2)
            });

            let status = response.status;
            console.log(`Creation response status ${status}`);
            if(status==201){
                getReports();
                successMessage = `Informe creado exitosamente`;
            } else if (status==404) {
                successMessage = `Informe no encontrado`;
            }else if (status==409) {
                successMessage = `Informe duplicado`;
            } else if (status==400) {
                successMessage = `Formato incorrecto`;
            }
            
            else
                errorMsg = "code:"+status
        } catch(e) {
            errorMsg = e;
        }
    }

    // Paginacion

    // Variables de paginación
    let limit = 10; // Número de elementos por página
    let offset = 0; // Desplazamiento inicial

    // Llama a la función getReports con los parámetros de paginación
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

    // Función para ir a una página específica
    function goToPage(pageNumber) {
        offset = (pageNumber - 1) * limit;
        getReports();
    }

    // Función para convertir el valor del campo "Año" a un entero
    function parseYear(value) {
        return parseInt(value);
    }

    function parseGDP(value) {
        return parseFloat(value);
    }

    function parseSocialSupport(value) {
        return parseInt(value);
    }

    function parseHealthyLifeExpectancy(value) {
        return parseFloat(value);
    }

    function parseGenerosity(value) {
        return parseInt(value);
    }

    function parsePositiveAffect(value) {
        return parseInt(value);
    }

    function parseNegativeAffect(value) {
        return parseInt(value);
    }

    function redirectToAnotherEditRoute(name, year) {
        navigate("happiness-reports/"+name+"/"+year+"/edit");
        window.location.reload();
    }

</script>

{#if errorMsg != ""}
ERROR: {errorMsg}
{/if}

<Row>
	<Col sm="3">
		<div class="api-section d-flex flex-column justify-content-end">
			<h2>Datos de la API</h2>
			<ul>
				{#each reports as r}
					<li class="py-1 reportItem">
						<div class="d-flex justify-content-between align-items-center">
							<div>
								<a href="/happiness-reports/{r.country_name}/{r.year}">{r.country_name} {r.year}</a>
							</div>
							<div class="edits">
								<Button
									color="danger"
									outline
									size="sm"
									on:click={() => deleteReport(r.country_name,r.year)}>Borrar</Button
								>
								&nbsp;
								<!---<a href="/happiness-reports/{r.country_name}/{r.year}"
                                --><Button color="success" outline size="sm" on:click={redirectToAnotherEditRoute(r.country_name, r.year)}>Editar</Button><!-- </a
								> -->
							</div>
						</div>
					</li>
				{/each}
			</ul>
            <div class="pagination" style="margin-bottom: 20px;">
                <Button style="margin-right: 10px;" on:click={previousPage} disabled={offset === 0}>Anterior</Button>
                <Button on:click={nextPage} disabled={reports.length < limit}>Siguiente</Button>
            </div>
			<div class="d-flex justify-content-between">
				<div>
					<Button style="margin-right: 10px;" color="danger" outline on:click={confirmDelete}>Borrar todos los reportes</Button>
				</div>
                <div>
					<Button color="primary" outline on:click={loadInitialData}>Cargar reportes iniciales</Button>
				</div>
			</div>
		</div>
	</Col>
    <Col sm="3">
		<div class="create-section">
			<h2>Buscar reportes</h2>
            <form on:submit|preventDefault={searchReports}>
                <table>
                    <tbody>
                        <tr>
                            <td class="py-1">Nombre País:</td>
                            <td class="py-1"><input placeholder="Nombre del país" bind:value={searchParams.country_name} /></td>
                        </tr>
                        <tr>
                            <td class="py-1">Año:</td>
                            <td class="py-1"><input type="number" placeholder="2030" bind:value={searchParams.year} /></td>
                        </tr>
                        <tr>
                            <td class="py-1">GDP:</td>
                            <td class="py-1"><input placeholder="7.697" bind:value={searchParams.gdp} /></td>
                        </tr>
                        <tr>
                            <td class="py-1">Soporte social:</td>
                            <td class="py-1"><input placeholder="491" bind:value={searchParams.social_support} /></td>
                        </tr>
                        <tr>
                            <td class="py-1">Estimación de vida saludable:</td>
                            <td class="py-1"><input placeholder="52.800" bind:value={searchParams.healthy_life_expectancy} /></td>
                        </tr>
                        <tr>
                            <td class="py-1">Generosidad:</td>
                            <td class="py-1"><input placeholder="-121" bind:value={searchParams.generosity} /></td>
                        </tr>
                        <tr>
                            <td class="py-1">Afecto Positivo:</td>
                            <td class="py-1"><input placeholder="496" bind:value={searchParams.possitive_affect} /></td>
                        </tr>
                        <tr>
                            <td class="py-1">Afecto Negativo:</td>
                            <td class="py-1"><input placeholder="371" bind:value={searchParams.negative_affect} /></td>
                        </tr>
                    </tbody>
                </table>
            <div class="centered-button">
                <Button color="primary" style="" outline>Buscar</Button>
            </div>
        </form>
    </div>
    {#if searchErrorMsg}
        <p>{searchErrorMsg}</p>
    {/if}
	</Col>
    {#if searchResults.length > 0}
    <Col sm="3">
    <div class="create-section">
        <h3>Resultados de la búsqueda:</h3>
        <ul>
            {#each searchResults as result}
                <li class="py-1 reportItem">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <a href="/happiness-reports/{result.country_name}/{result.year}">{result.country_name} {result.year}</a>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
    </Col>
    {/if}
	<Col sm="3">
		<div class="create-section">
			<h2>Añadir nuevo Reporte</h2>
            <table>
                <tbody>
                    <tr>
                        <td class="py-1">Nombre País:</td>
                        <td class="py-1"><input placeholder="Nombre del país" bind:value={newReport.country_name} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Año:</td>
                        <td class="py-1"><input type="number" placeholder="2030" on:input={e => newReport.year = parseYear(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">GDP:</td>
                        <td class="py-1"><input placeholder="7.697" on:input={e => newReport.gdp = parseGDP(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Soporte social:</td>
                        <td class="py-1"><input placeholder="491" on:input={e => newReport.social_support = parseSocialSupport(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Estimación de vida saludable:</td>
                        <td class="py-1"><input placeholder="52.800" on:input={e => newReport.healthy_life_expectancy = parseHealthyLifeExpectancy(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Generosidad:</td>
                        <td class="py-1"><input placeholder="-121" on:input={e => newReport.generosity = parseGenerosity(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Afecto Positivo:</td>
                        <td class="py-1"><input placeholder="496" on:input={e => newReport.possitive_affect = parsePositiveAffect(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Afecto Negativo:</td>
                        <td class="py-1"><input placeholder="371" on:input={e => newReport.negative_affect = parseNegativeAffect(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>
			<div class="centered-button">
				<Button color="primary" outline on:click={createReport}>Crear</Button>
			</div>
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
		display: flex;
        justify-content: center;
        margin-top: 1em;
	}
	.edits {
		display: flex;
		margin-left: 2em;
	}
</style>
