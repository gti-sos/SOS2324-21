<script>
    import {page} from '$app/stores';
    import { dev } from "$app/environment";
    import { Button, Col, Row } from '@sveltestrap/sveltestrap';
    import { navigate } from 'svelte-routing';

    let country_name = $page.params.country_name;
    let year = $page.params.year;
    let API = "/api/v1/happiness-reports";
    let errorMsg="";
    let successMessage="";
    let report = {};

    if(dev)
        API = "http://localhost:10000"+API;

    async function getEditReport(){
        try{
            let response = await fetch(API+"/"+country_name +"/"+year,{
                method: "GET"
            });

            let data = await response.json();
            report = data;
            
        } catch(e) {
            errorMsg = e;
        }
    }
    getEditReport(); 
    async function updateReport(){
        try {
            let response = await fetch(API+"/"+country_name +"/"+year,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(report)
            });

            let status = response.status;
            if (response.status==404) {
                successMessage = `Informe no encontrado`;
            }else if (response.status==200) {
                successMessage = `Informe editado`;
            } else if (response.status==400) {
                successMessage = `Formato incorrecto`;
            } 
            console.log(`Creation response status ${status}`);
            

            navigate("/happiness-reports/");
            window.location.reload();
        } catch(e) {
            errorMsg = e;
        }
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

</script>
{#if successMessage}
	<p>{successMessage}</p>
{/if}
{#if errorMsg != ""}
ERROR: {errorMsg}
{/if}

Editar {country_name} con el año {year}

<hr>

<!-- svelte-ignore missing-declaration -->
<Row>
    <Col sm="6">
        <div class="create-section">
            <h2>Editar Reporte</h2>
            <table>
                <tbody>
                    <tr>
                        <td class="py-1">GDP:</td>
                        <td class="py-1"><input value={report.gdp} on:input={e => report.gdp = parseGDP(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Soporte social:</td>
                        <td class="py-1"><input value={report.social_support} on:input={e => report.social_support = parseSocialSupport(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Estimación de vida saludable:</td>
                        <td class="py-1"><input value={report.healthy_life_expectancy} on:input={e => report.healthy_life_expectancy = parseHealthyLifeExpectancy(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Generosidad:</td>
                        <td class="py-1"><input value={report.generosity} on:input={e => report.generosity = parseGenerosity(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Afecto Positivo:</td>
                        <td class="py-1"><input value={report.possitive_affect} on:input={e => report.possitive_affect = parsePositiveAffect(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Afecto Negativo:</td>
                        <td class="py-1"><input value={report.negative_affect} on:input={e => report.negative_affect = parseNegativeAffect(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>
            <div class="centered-button">
                
            </div>
            <div class="button-center">
                <Button color="primary" outline on:click={updateReport}>Editar</Button>
                <a href="/happiness-reports" class="button-margin-left">
                    <Button color="secondary" outline>Volver al Inicio</Button>
                </a>
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
</style>
