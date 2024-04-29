<svelte:head>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    // Datos de ejemplo
    let areaData = [];

    onMount(async () => {
        await getData();
    });

    async function getData() {
        try {
            const res = await fetch(`/api/v2/cause-of-deaths`);
            const data = await res.json();
            areaData = data;
            drawAreaChart(areaData);
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    function drawAreaChart(data) {
        d3.select('#chart-container'); // Limpia el contenedor antes de añadir el gráfico

        const svg = d3.select('#chart-container')
            .append('svg')
            .attr('width', '100%')
            .attr('height', 400);

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(data.map((d) => d.year));

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, d3.max(data, (d) => d.total)]);

        const area = d3.area()
            .x((d) => x(d.year))
            .y1((d) => y(d.total))
            .y0(height);

        const g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        g.append('path')
            .datum(data)
            .attr('fill', 'steelblue')
            .attr('d', area);

        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        g.append('g')
            .call(d3.axisLeft(y).ticks(10))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('Casos');
    }
</script>

<div class="column-container">
    <h3 class="text-center">Gráfico de Área - Cause of Deaths</h3>
</div>

<div id="chart-container" style="width:80%; height:400px; margin: 0 auto;"></div>

<style>
    .column-container {
        border-radius: 10px; /* Esquinas redondeadas */
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Sombra */
        padding: 20px; /* Espacio interno */
        background-color: white; /* Color de fondo */
        margin: 20px;
        display: flex;
        flex-direction: column;
    }
    .text-center {
        text-align: center;
    }
</style>
