<script>
  import { onMount } from 'svelte';
  import { Button, Row, Col } from '@sveltestrap/sveltestrap';
  import Highcharts from 'highcharts';


  let data = null;

  onMount(async () => {
    await fetchData();
    console.log(data)
  });

  const fetchData = async () => {
    const url = 'https://jsearch.p.rapidapi.com/search?query=Python%20developer%20in%20Texas%2C%20USA&page=1&num_pages=1';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '70279dac2dmsh1a9b57adeb8f4e3p14fbddjsn7c8f8225b009',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      data = result.data
    } catch (error) {
      console.error(error);
    }
  };

  function generatePieChart() {
    let employmentTypes = {};
    
    // Count occurrences of each employment type
    data.forEach(item => {
      const employmentType = item.job_employment_type;
      if (employmentTypes[employmentType]) {
        employmentTypes[employmentType]++;
      } else {
        employmentTypes[employmentType] = 1;
      }
    });
    
    // Convert counts to percentages
    const totalObjects = data.length;
    const pieData = Object.entries(employmentTypes).map(([type, count]) => ({
      name: type,
      y: (count / totalObjects) * 100
    }));

    // Generate pie chart
    Highcharts.chart('chart-container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Distribución de tipos de empleo'
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
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Percentage',
        colorByPoint: true,
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
      <h3 class="text-center">Tipos de Empleo</h3>
      <div class="button-center">
        <Button class="m-1" color="primary" on:click={generatePieChart}>
          Generar gráfico de tarta
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
