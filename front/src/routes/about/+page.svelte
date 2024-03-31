<script>
    import {dev} from '$app/environment';
    let mode="production";

    if(dev)
        mode="development";
</script>
<p></p>
<p>This is the contact manager app in {mode} mode.</p>