<script>
	/**
	 * @typedef {Object} Props
	 * @property {any} cash
	 * @property {any} [presale]
	 */

	/** @type {Props} */
	let { cash, presale = null } = $props();
</script>

<p class="karla">
	<i class="bi bi-ticket-perforated pe-2"></i>
	{#if cash == 0}
		vstup zdarma
	{:else}
		{cash},-&nbsp;Kč {#if presale != null}(na místě){/if}
	{/if}
</p>
{#if presale != null}
	<p class="karla">
		<i class="bi bi-ticket-detailed pe-2"></i>{presale},-&nbsp;Kč (v předprodeji)
	</p>
{/if}
