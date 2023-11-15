<script>
	export let cash;
	export let presale = null;
</script>

<p class="neue"><i class="bi bi-ticket-perforated pe-2" />{cash},-&nbsp;Kč {#if presale != null}(na místě){/if}</p>
{#if presale != null}
	<p class="neue">
		<i class="bi bi-ticket-detailed pe-2" />{presale},-&nbsp;Kč (v předprodeji)
	</p>
{/if}
