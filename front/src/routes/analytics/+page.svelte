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

  async function getDataCauses() {
    try {
        await fetch(causesAPI+'/loadInitialData', {
                method: "GET",
        });
        let allData = [];
        let page = 1;
        let limit = 10; // Cantidad de datos a recuperar por página

        while (true) {
            const res = await fetch(`${causesAPI}?limit=${limit}&offset=${(page - 1) * limit}`);
            const data = await res.json();

            if (data.length === 0) {
                break; // No hay más datos, salir del bucle
            }

            allData = allData.concat(data);
            page++;
        }
        return allData
    } catch (error) {
        console.log(`Error fetching data: ${error}`);
    }
}

  async function getData(API) {
        try {
            await fetch(API+'/loadInitialData', {
                method: "GET",
            });
            const res = await fetch(API);
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

  async function mixData() {
    const causesData = await getDataCauses(causesAPI);
    const reportsData = await getData(reportsAPI);

    let dataMixed = [];
    for (var j = 0; j < reportsData.length; j++) {
        for (var i = 0; i < reportsData.length; i++) {
            if (causesData[i].year == reportsData[j].year){
                dataMixed.push({
                    "year": reportsData[j].year,
                    "healthy_life_expectancy": reportsData[j].healthy_life_expectancy,
                    "possitive_affect": reportsData[j].possitive_affect,
                    "negative_affect": reportsData[j].negative_affect,
                    "nutricional_deficiencie": causesData[i].nutricional_deficiencie,
                    "alzheimer": causesData[i].alzheimer
                });
            }
        }
    }
    console.log(dataMixed)
    dataMixed.sort(function(a, b) {
        return a.year - b.year;
    });
      // Convertir objeto combinado en un array
      Data = dataMixed
      //console.log(Data)
  }
  
  function createChart() {
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
            categories: Data.map((item) => item.year)
        },
        yAxis: [{
            title: {
                text: 'Nefative Affect'
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
            name: 'Negative Affect',
            data: Data.map((item) => item.negative_affect)
        }, {
            name: 'Nutricional Deficiencie',
            data: Data.map((item) => item.nutricional_deficiencie),
            yAxis: 1
        }]
        });
    }


  onMount(async () => {

    try {
      await mixData();
      createChart();

    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }

  });

</script>



<div id="container" style="width:100%; height:400px;"></div>