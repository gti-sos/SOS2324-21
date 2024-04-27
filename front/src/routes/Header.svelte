<script>
	import { Navbar, NavbarBrand, Nav, NavLink, NavItem, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from '@sveltestrap/sveltestrap';
</script>

<Navbar style=" box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)" color="light" light expand="md">
	<Nav navbar>
		<NavLink href="/">Inicio</NavLink>
		<NavLink href="/cause-of-deaths">Cause of Deaths</NavLink>
		<NavLink href="/happiness-reports">Happiness reports</NavLink>
		<NavLink href="/analytics">Analytics</NavLink>
		<NavItem
			><ButtonDropdown>
				<DropdownToggle color="" caret>Graphics</DropdownToggle>
				<DropdownMenu>
					<DropdownItem><a href="/cause-of-deaths/graphMRC">Highcharts Graphics</a></DropdownItem>
					<DropdownItem><a href="/cause-of-deaths/graphD3">D3 Graphics</a></DropdownItem>
				</DropdownMenu>
			</ButtonDropdown>
		</NavItem>

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
