<svelte:head>

  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>

<script>

  import { onMount } from 'svelte';

  const causesAPI = 'http://localhost:10000/api/v2/cause-of-deaths';
  const reportsAPI = 'http://localhost:10000/api/v1/happiness-reports';
  let Data = [];

  async function getData(url) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

  async function processData() {
      const causesData = await getData(causesAPI);
      const reportsData = await getData(reportsAPI);
      const processedData = {};

      causesData.forEach(c => {
          const country_name = c.country_name;
          const year = c.year;
          const nutricional_deficiencie = c.nutricional_deficiencie;
        
          if (!processedData[year]) {
              processedData[year] = {
                  country: country_name,
                  year: year,
                  nutricional_deficiencie: nutricional_deficiencie,
                  healthy_life_expectancy: 0
              };
          }

          processedData[year].nutricional_deficiencie = nutricional_deficiencie || 0;
      });

      reportsData.forEach(r => {
        const country_name = r.country_name;
        const year = r.year;
        const healthy_life_expectancy = r.healthy_life_expectancy;

        if (!processedData[year]) {
            processedData[year] = {
                country: country_name,
                year: year,
                nutricional_deficiencie: 0,
                healthy_life_expectancy: healthy_life_expectancy
            };
        }
        processedData[year].healthy_life_expectancy = healthy_life_expectancy || 0;
      });

      // Convertir objeto combinado en un array
      Data = Object.values(processedData);
      console.log(Data)
  }
  
  function createChart(Data) {
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Datos por año'
        },
        xAxis: {
            title: {
                text: 'Año'
            },
            categories: Data.map(year => year.year)
        },
        yAxis: [{
            title: {
                text: 'Healthy life expectancy'
            }
        }, {
            title: {
                text: 'Nutricional Deficiencie'
            },
            opposite: true,
            min: 0
        }],
        tooltip: {
            shared: true
        },
        series: [{
            name: 'Healthy life expectancy',
            data: Data.map(year => year.healthy_life_expectancy)
        }, {
            name: 'Nutricional Deficiencie',
            data: Data.map(year => year.nutricional_deficiencie),
            yAxis: 1
        }]
        });
    }


  onMount(async () => {

    try {
      await processData();
      createChart();

    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }

  });

</script>



<div id="container" style="width:100%; height:400px;"></div>