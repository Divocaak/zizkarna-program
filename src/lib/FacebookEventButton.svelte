<script>
	export let fbEvent = null;
</script>

<a href={fbEvent} class="btn btn-outline-primary karla mt-1" class:disabled={fbEvent == null} target="_blank">
	<i class="pe-2 bi bi-facebook" />FB událost {fbEvent != null ? '' : ' již brzy'}
</a>
