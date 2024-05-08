<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { Button, Row, Col } from '@sveltestrap/sveltestrap';
  
    let API = 'https://sos2324-21.appspot.com/api/v1/happiness-reports';
    if (dev) {
      API = 'https://localhost:10000/api/v1/happiness-reports';
    }
  
    let Data = [];
  
    onMount(async () => {
      await getData();
    });
  
    async function getData() {
      try {
        let offset = 0;
        let limit = 10;
        await fetch(`${API}/loadInitialData`);
        const res = await fetch(`${API}?limit=${limit}&offset=${offset}`);
        const data = await res.json();
        Data = data;
      } catch (error) {
        console.log(`Error fetching data: ${error}`);
      }
    }
  
    function filterAreaData(data, selectedCountry) {
      const filteredData = data.filter((item) => item.country_name === selectedCountry);
      const transformedData = filteredData.map((item) => ({
        year: item.year,
        possitive_affect: item.possitive_affect,
        negative_affect: item.negative_affect
      }));
      transformedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
      areaChart(transformedData, selectedCountry);
    }
  
    function filterColumnData(data, selectedCountry) {
      const filteredData = data.filter((item) => item.country_name === selectedCountry);
      const transformedData = filteredData.map((item) => ({
        year: item.year,
        gdp: item.gdp,
        generosity: item.generosity
      }));
      transformedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
      columnChart(transformedData, selectedCountry);
    }
  
    function areaChart(data, selectedCountry) {
      c3.generate({
        bindto: '#chart-container',
        data: {
          x: 'year',
          columns: [
            ['year'].concat(data.map((item) => item.year)),
            ['Possitive Affect'].concat(data.map((item) => item.possitive_affect)),
            ['Negative Affect'].concat(data.map((item) => item.negative_affect))
          ]
        },
        axis: {
          x: {
            label: {
              text: 'Year',
              position: 'outer-center'
            },
            type: 'category'
          },
          y: {
            label: {
              text: 'Affect Quantity',
              position: 'outer-middle'
            }
          }
        },
        title: {
          text: `Afecto positivo y negativo de 2008 - 2017 en ${selectedCountry}`
        }
      });
    }
  
    function columnChart(data, selectedCountry) {
      c3.generate({
        bindto: '#container',
        data: {
          x: 'year',
          columns: [
            ['year'].concat(data.map((item) => item.year)),
            ['GDP'].concat(data.map((item) => item.gdp)),
            ['Generosidad'].concat(data.map((item) => item.generosity))
          ],
          axes: {
            GDP: 'y',
            Generosidad: 'y2'
          }
        },
        axis: {
          x: {
            label: {
              text: 'Year',
              position: 'outer-center'
            },
            type: 'category'
          },
          y: {
            label: {
              text: 'GDP',
              position: 'outer-middle'
            }
          },
          y2: {
            show: true,
            label: {
              text: 'Generosidad',
              position: 'outer-middle'
            }
          }
        },
        title: {
          text: 'GDP por año'
        }
      });
    }
  </script>
  
  <svelte:head>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css">
    <script defer src="https://d3js.org/d3.v5.min.js"></script>
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
  </svelte:head>
  
  <Row>
    <Col>
      <div class="column-container">
        <h3 class="text-center">Gráficos C3 API - Happiness Reports</h3>
        <div class="button-center">
          <Button class="m-1" color="primary" on:click={filterAreaData(Data, 'Afghanistan')}>
            Gráfico de Afecto
          </Button>
          <Button class="m-1" color="primary" on:click={filterColumnData(Data, 'Afghanistan')}>
            Gráfico de GDP
          </Button>
        </div>
      </div>
    </Col>
  </Row>
  
  <Row>
    <Col>
      <div id="chart-container" style="width: 80%; height: 500px; margin: 0 auto;"></div>
      <div id="container" style="min-width: 310px; height: 400px; margin: 0 auto;"></div>
    </Col>
  </Row>
  
  <style>
    .column-container {
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      background-color: white;
      margin: 20px;
      display: flex;
      flex-direction: column;
    }
  
    .button-center {
      display: flex;
      justify-content: center;
    }
  </style>
  