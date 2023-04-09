<script>
	export let tickets = null;
</script>

{#if tickets != null}
	<a href={tickets} class="btn btn-outline-secondary neue mt-1" target="_blank">
		<i class="pe-2 bi bi-ticket-perforated-fill" />Předprodej lístků
	</a>
{/if}
