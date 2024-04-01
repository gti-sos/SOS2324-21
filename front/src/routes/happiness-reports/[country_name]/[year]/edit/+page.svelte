<script>
    import {page} from '$app/stores';
    import { dev } from "$app/environment";
    import { Button, Col, Row } from '@sveltestrap/sveltestrap';
    import { navigate } from 'svelte-routing';

    let country_name = $page.params.country_name;
    let year = $page.params.year;
    let API = "/api/v1/happiness-reports";
    let errorMsg="";
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
                        <td class="py-1"><input placeholder="7.697" on:input={e => report.gdp = parseGDP(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Soporte social:</td>
                        <td class="py-1"><input placeholder="491" on:input={e => report.social_support = parseSocialSupport(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Estimación de vida saludable:</td>
                        <td class="py-1"><input placeholder="52.800" on:input={e => report.healthy_life_expectancy = parseHealthyLifeExpectancy(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Generosidad:</td>
                        <td class="py-1"><input placeholder="-121" on:input={e => report.generosity = parseGenerosity(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Afecto Positivo:</td>
                        <td class="py-1"><input placeholder="496" on:input={e => report.possitive_affect = parsePositiveAffect(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Afecto Negativo:</td>
                        <td class="py-1"><input placeholder="371" on:input={e => report.negative_affect = parseNegativeAffect(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>
            <div class="centered-button">
                <Button color="primary" outline on:click={updateReport}>Editar</Button>
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
