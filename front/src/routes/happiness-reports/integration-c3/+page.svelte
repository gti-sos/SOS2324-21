<script>
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  import { Button, Row, Col } from '@sveltestrap/sveltestrap';

  let API = 'https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions?minPopulation=5&limit=10';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '70279dac2dmsh1a9b57adeb8f4e3p14fbddjsn7c8f8225b009',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  let data = null;

  onMount(async () => {
    await fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await fetch(API, options);
      const result = await response.json();
      data = result["data"];
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  function generateBarChart() {
    const cities = data.map(item => item.name);
    const populations = data.map(item => item.population);
    
    c3.generate({
      bindto: '#chart-container',
      data: {
        x: 'City',
        columns: [
          ['City'].concat(cities),
          ['Population'].concat(populations)
        ],
        type: 'bar'
      },
      axis: {
        x: {
          label: {
            text: 'City',
            position: 'outer-center'
          },
          type: 'category'
        },
        y: {
          label: {
            text: 'Population',
            position: 'outer-middle'
          }
        }
      },
      title: {
        text: 'Population of Cities'
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
      <h3 class="text-center">Population of Cities</h3>
      <div class="button-center">
        <Button class="m-1" color="primary" on:click={generateBarChart}>
          Generate Bar Chart
        </Button>
      </div>
    </div>
  </Col>
</Row>

<Row>
  <Col>
    <div id="chart-container" style="width: 80%; height: 500px; margin: 0 auto;"></div>
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
