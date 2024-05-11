<script>
	import { Navbar, NavbarBrand, Nav, NavLink, NavItem, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from '@sveltestrap/sveltestrap';
</script>

<Navbar style=" box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)" color="light" light expand="md">
	<Nav navbar>
		<NavLink href="/">Inicio</NavLink>
		<NavLink href="/cause-of-deaths">Cause of Deaths</NavLink>
		<NavLink href="/happiness-reports">Happiness reports</NavLink>
		<NavLink href="/analytics">Análisis</NavLink>
		<NavItem
			><ButtonDropdown>
				<DropdownToggle color="" caret>Integraciones</DropdownToggle>
				<DropdownMenu>
					<DropdownItem><a href="/cause-of-deaths/integrationProxy">Highcharts - Cause of Deaths</a></DropdownItem>
					<DropdownItem><a href="/integrations">Highcharts - Happiness Report</a></DropdownItem>
				</DropdownMenu>
			</ButtonDropdown>
		</NavItem>
		<NavItem
			><ButtonDropdown>
				<DropdownToggle color="" caret>Usos</DropdownToggle>
				<DropdownMenu>
					<DropdownItem><a href="/cause-of-deaths/instagram">API Instagram - Cause of Deaths</a></DropdownItem>
					<DropdownItem><a href="/cause-of-deaths/github">API GitHub - Cause of Deaths</a></DropdownItem>
					<DropdownItem><a href="/cause-of-deaths/shazam">API Shazam - Cause of Deaths</a></DropdownItem>
				</DropdownMenu>
			</ButtonDropdown>
		</NavItem>
		<NavItem
			><ButtonDropdown>
				<DropdownToggle color="" caret>Graphics</DropdownToggle>
				<DropdownMenu>
					<DropdownItem><a href="/happiness-reports/graph">Highcharts - Happiness Reports</a></DropdownItem>
					<DropdownItem><a href="/cause-of-deaths/graphHighchart">Highcharts - Cause of Deaths</a></DropdownItem>
					<DropdownItem><a href="/cause-of-deaths/graphBillboard">Billboard - Cause of Deaths</a></DropdownItem>
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
