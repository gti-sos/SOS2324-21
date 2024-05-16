<script>
  import { onMount } from 'svelte';
  import { Button, Row, Col } from '@sveltestrap/sveltestrap';
  import Highcharts from 'highcharts';

  let API = 'https://sos2324-21.ew.r.appspot.com/proxyCritics';
  let data = null;

  onMount(async () => {
      await fetchData();
  });


  const fetchData = async () => {
    try {
        const response = await fetch(API);
        const result = await response.json();
        data = result;
        console.log(data);
    } catch (error) {
        console.error(error);
    }
  };

  function generateBarChart() {
    const names = data.map(item => item.name);
    const scores = data.map(item => item.topCriticScore);

    // Generate bar chart
    Highcharts.chart('chart-container', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Juegos recientes con mejores críticas'
      },
      xAxis: {
        categories: names,
        title: {
          text: 'Game'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Top Critic Score',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ''
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Puntuación de las críticas',
        data: scores
      }]
    });
  }
</script>

<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<Row>
  <Col>
    <div class="column-container">
      <h3 class="text-center">Puntajes de los Mejores Críticos para Juegos</h3>
      <div class="button-center">
        <Button class="m-1" color="primary" on:click={generateBarChart}>
          Generar gráfico de barras
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
