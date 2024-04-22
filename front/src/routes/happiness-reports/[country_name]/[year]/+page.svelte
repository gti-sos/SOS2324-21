<script>
    import {page} from '$app/stores';
    import { dev } from "$app/environment";
    import { Button, Col, Row } from '@sveltestrap/sveltestrap';

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
            
            let status = await response.status;

            if(status == 404){
                console.log(status);
                errorMsg = "No se encontro el reporte";
            } else {
                let data = await response.json();
                report = data;
            }
        } catch(e) {
            console.log(e);
        }
    }
    getEditReport(); 
</script>

<hr>

Detalles de {country_name} con año {year}


    
{#if successMessage}
	<p>{successMessage}</p>
{/if}

{#if errorMsg != ""}
<hr>

{errorMsg}


{:else}

<hr>

<Row>
    <Col sm="6">
        <div class="create-section">
            <h2>Datos del Reporte</h2>
            <table>
                <tbody>
                    <tr>
                        <td class="py-1">País:</td>
                        <td class="py-1"><input value={report.country_name} readonly/></td>
                    </tr>
                    <tr>
                        <td class="py-1">Año:</td>
                        <td class="py-1"><input value={report.year} readonly /></td>
                    </tr>
                    <tr>
                        <td class="py-1">GDP:</td>
                        <td class="py-1"><input value={report.gdp} readonly /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Soporte social:</td>
                        <td class="py-1"><input value={report.social_support} readonly /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Estimación de vida saludable:</td>
                        <td class="py-1"><input value={report.healthy_life_expectancy} readonly /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Generosidad:</td>
                        <td class="py-1"><input value={report.generosity} readonly /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Afecto Positivo:</td>
                        <td class="py-1"><input value={report.possitive_affect} readonly /></td>
                    </tr>
                    <tr>
                        <td class="py-1">Afecto Negativo:</td>
                        <td class="py-1"><input value={report.negative_affect} readonly /></td>
                    </tr>
                </tbody>
            </table>
            <div class="centered-button">
                
            </div>
            <div class="button-center">
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

{/if}


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
