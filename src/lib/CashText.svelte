<script>
	export let cash;
	export let presale = null;
</script>

<p class="karla">
	<i class="bi bi-ticket-perforated pe-2" />
	{#if cash == 0}
		bez vstupného
	{:else}
		{cash},-&nbsp;Kč {#if presale != null}(na místě){/if}
	{/if}
</p>
{#if presale != null}
	<p class="karla">
		<i class="bi bi-ticket-detailed pe-2" />{presale},-&nbsp;Kč (v předprodeji)
	</p>
{/if}
