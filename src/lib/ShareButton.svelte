<script>
	export let label;
	let text = 'Přijď do Žižkárny na ' + label;
	
	import { page } from '$app/stores';
	export let urlSuffix = "";
	let url = $page.url.href + urlSuffix;
	
	export let title = url.split('/').splice(-1)[0];

	let complete = false;

	async function handleClick() {
		try {
			if (navigator.canShare) {
				await navigator.share({ text, url, title });
			} else {
				await navigator.clipboard.writeText(url);
				complete = true;
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<button on:click={handleClick} class="btn btn-outline-secondary">
	<i class="bi bi-share-fill pe-2" />
	{#if complete}
		<slot name="complete">Odkaz zkopírován</slot>
	{:else}
		<slot>Sdílet</slot>
	{/if}
</button>
