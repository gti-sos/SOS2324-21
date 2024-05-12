<script>
  import { onMount } from 'svelte';
  import { Button, Row, Col } from '@sveltestrap/sveltestrap';
  import Highcharts from 'highcharts';

  let API = 'https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=corolla&limit=20';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '70279dac2dmsh1a9b57adeb8f4e3p14fbddjsn7c8f8225b009',
      'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com'
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
      data = result;
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  function generatePieChart() {
    let classCounts = {};
    
    // Count occurrences of each class
    data.forEach(item => {
      const carClass = item.class;
      if (classCounts[carClass]) {
        classCounts[carClass]++;
      } else {
        classCounts[carClass] = 1;
      }
    });
    
    // Convert counts to percentages
    const totalObjects = data.length;
    const pieData = Object.entries(classCounts).map(([className, count]) => ({
      name: className,
      y: (count / totalObjects) * 100
    }));

    // Generate pie chart
    Highcharts.chart('chart-container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: 'Distribucion de clases de coches',
        align: 'center',
        verticalAlign: 'middle',
        y: 60,
        style: {
          fontSize: '1.1em'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Car Class Share',
        innerSize: '50%',
        data: pieData
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
      <h3 class="text-center">Clases de Autos</h3>
      <div class="button-center">
        <Button class="m-1" color="primary" on:click={generatePieChart}>
          Generar gráfico semicircular
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
