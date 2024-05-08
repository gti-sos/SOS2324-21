<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import bb, { areaSpline } from 'billboard.js';
    import { area } from 'billboard.js';
    import { Button, Row, Col } from '@sveltestrap/sveltestrap';

    import 'billboard.js/dist/billboard.css'; // Importa los estilos CSS de Billboard.js

    let DATAAPI = '/api/v2/cause-of-deaths';

    if (dev) {
        DATAAPI = 'http://localhost:10000/api/v2/cause-of-deaths';
    }

    let areaData = [];

    onMount(async () => {
        await getData();
    });

    async function getData() {
        try {
            let allData = [];
            let page = 1;
            const limit = 10;

            while (true) {
                const res = await fetch(`${DATAAPI}?limit=${limit}&offset=${(page - 1) * limit}`);
                const data = await res.json();

                if (data.length === 0) {
                    break; // No hay más datos, salir del bucle
                }

                allData = allData.concat(data);
                page++;
            }

            areaData = allData;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    let chart; // Variable para almacenar el gráfico

    function filterAreaData(data, selectedCountry) {
        const filteredData = data.filter((item) => item.country_name === selectedCountry);
        const transformedData = filteredData.map((item) => ({
            year: item.year,
            meningitis: item.meningitis,
			alzheimer: item.alzheimer,
			parkinson: item.parkinson,
			nutricional_deficiencie: item.nutricional_deficiencie,
			malaria: item.malaria
        }));
        transformedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));

        if (!chart) {
            // Si el gráfico no existe, lo generamos
            chart = bb.generate({
                data: {
                    json: transformedData,
                    keys: {
                        x: 'year',
                        value: ['meningitis','alzheimer', 'parkinson','nutricional_deficiencie','malaria']
                    },
                    types: {
                        alzheimer: area(),
                        parkinson: areaSpline(),
                        nutricional_deficiencie: areaSpline(),
                        malaria: areaSpline(),
                        meningitis: areaSpline()
                    }
                },
                axis: {
                    x: {
                        type: 'category',
                        label: {
                            text: 'Año'
                        }
                    },
                    y: {
                        label: {
                            text: 'Número de personas afectadas'
                        }
                    }
                },
                bindto: '#areaChart'
            });
        } else {
            // Si el gráfico ya existe, actualizamos los datos
            chart.load({
                json: transformedData,
            });
        }
    }
</script>

<svelte:head></svelte:head>

<Row>
    <Col>
        <div class="column-container">
            <h3 class="text-center">Comparación de todas las enfermedades a lo largo de los años, en México</h3>
            <h5 class="subtitle">Gráfico de Área - Billboard.js</h5>
            <div class="button-center">
                <Button class="m-1" color="primary" on:click={filterAreaData(areaData, 'Mexico')}>Generar</Button>
            </div>
        </div>
    </Col>
</Row>
<Row>
    <Col>
        <div id="areaChart" style="width:90%; height:500px; margin: 0 auto;"></div>
    </Col>
</Row>

<style>
    .column-container {
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        background-color: white;
        margin: 2rem;
        display: flex;
        flex-direction: column;
    }

    .text-center {
        text-align: center;
    }

    .subtitle {
        text-align: center;
        font-style: italic;
        color: #666;
    }

    #areaChart {
        padding: 1rem;
    }

    .button-center {
        display: flex;
        justify-content: center;
    }


</style>
