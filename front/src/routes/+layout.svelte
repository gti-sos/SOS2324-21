<script>
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
    import { Styles } from '@sveltestrap/sveltestrap';

    
</script>

<Header />
<slot></slot>
<hr/>
<Footer />


<Styles />