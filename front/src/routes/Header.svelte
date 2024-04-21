<script>
    import { Navbar, NavbarBrand, Nav, NavLink } from '@sveltestrap/sveltestrap';
</script>

<Navbar style=" box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)" color="light"  light expand="md">
    <Nav navbar>
        <NavLink href="/">Inicio</NavLink>
        <NavLink href="/cause-of-deaths">Cause of Deaths</NavLink>
        <NavLink href="/happiness-reports">Happiness reports</NavLink>
        <NavLink href="/graphMRC">Graphs</NavLink>
        <NavLink href="/about">Sobre nosotros...</NavLink>

    </Nav>
</Navbar>

<style>
    /* Puedes agregar estilos adicionales aquí si lo necesitas */
</style>
