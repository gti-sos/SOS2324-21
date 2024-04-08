<script>
    // Importamos los componentes necesarios de Sveltestrap
    import { Container, Row, Col } from '@sveltestrap/sveltestrap';
</script>

<Container>
    <p></p>
    <Row>
        <Col class="text-center">
            <h1>SOS2324-21</h1>
        </Col>
    </Row>
    <hr/>
    <Row>
        <Col sm="7">
            <h2>Project Description:</h2>
            <p>We are going to explore the relation between death causes in a global level, chocolate consumption per capita
                and the global happiness index. Our work will focus on analyzing how these three aspects are interconnected
                through data from different global data sets.</p>
        </Col>
        <Col sm="4">
            <h2>Team:</h2>
            <ul>
                <li><a href="https://github.com/marrodcab12">Maria Luisa Rodriguez Cabrera</a></li>
                <li><a href="https://github.com/aaleejandro01">Alejandro Morilla Garcia</a></li>
                <li><a href="https://github.com/jesmenmar">Jesus Manuel Méndez Martínez</a></li>
            </ul>
        </Col>
    </Row>

    <Row>
        <Col sm="7">
            <h2>Repository:</h2>
            <p>Accessible at: <a href="https://github.com/gti-sos/SOS2324-21">https://github.com/gti-sos/SOS2324-21</a></p>
        </Col>

        <Col sm="5">
            <h2>URLs:</h2>
            <p>- GCloud link: <a href="https://sos2324-21.ew.r.appspot.com">https://sos2324-21.ew.r.appspot.com</a></p>
        </Col>
    </Row>

    <Row>
        <Col>
            <h2>APIs:</h2>
            <ul>
                <li>Cause of deaths - V1: <a href="https://sos2324-21.ew.r.appspot.com/api/v1/cause-of-deaths/docs">https://sos2324-21.ew.r.appspot.com/api/v1/cause-of-deaths/docs</a> (developed by Maria Luisa Rodriguez Cabrera)</li>
                <li>Cause of deaths - V2: <a href="https://sos2324-21.ew.r.appspot.com/api/v2/cause-of-deaths/docs">https://sos2324-21.ew.r.appspot.com/api/v2/cause-of-deaths/docs</a> (developed by Maria Luisa Rodriguez Cabrera)</li>
                <li>Happiness reports: <a href="https://sos2324-21.ew.r.appspot.com/api/v1/happiness-reports/docs">https://sos2324-21.ew.r.appspot.com/api/v1/happiness-reports/docs</a> (developed by Jesús Manuel Méndez Martínez)</li>
                <li>Chocolate Ratings: <a href="https://sos2324-21.ew.r.appspot.com/api/v1/chocolate-ratings/docs">https://sos2324-21.ew.r.appspot.com/api/v1/chocolate-ratings/docs</a> (developed by Alejandro Morilla García)</li>
            </ul>
        </Col>
    </Row>
</Container>

<style>
    h2 {
        font-size: 1.5em;
    }
    
</style>