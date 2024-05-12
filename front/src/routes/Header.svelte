<script>
	import { Navbar, Nav, NavLink, NavItem, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from '@sveltestrap/sveltestrap';
</script>


<Navbar style=" box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)" color="light" light expand="md" >
	<Nav navbar>
		<NavLink href="/">Inicio</NavLink>
		<NavItem
			><ButtonDropdown>
				<DropdownToggle color="" caret>Front-ends</DropdownToggle>
				<DropdownMenu>
					<DropdownItem><a href="/happiness-reports">Happiness Reports</a></DropdownItem>
					<DropdownItem><a href="/cause-of-deaths">Cause of Deaths</a></DropdownItem>
				</DropdownMenu>
			</ButtonDropdown>
		</NavItem>
		<NavLink href="/analytics">Análisis</NavLink>
		<NavLink href="/integrations">Integraciones</NavLink>
		<NavLink href="/graphics">Gráficos</NavLink>
		<NavLink href="/about">Sobre nosotros...</NavLink>
	</Nav>
</Navbar>

<style>
    a {
        color: #1e90ff;
        text-decoration: none;
        font-weight: bold;
		
    }
    </style>
