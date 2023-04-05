<script>
	export let fbEvent = null;
</script>

<a href={fbEvent} class="btn btn-outline-primary neue" class:disabled={fbEvent == null}>
	<i class="pe-2 bi bi-facebook" />Událost {fbEvent != null ? '' : ' již brzy'}
</a>
