<script>
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
    import { Styles } from '@sveltestrap/sveltestrap';

    
</script>

<svelte:head>
    <title>SOS2324-21</title>
</svelte:head>

<Header />
<slot></slot>
<hr/>
<Footer />


<Styles />