<script>
	import { onMount } from 'svelte';

	export let path, alt;

	let loaded = false;
	let failed = false;
	let loading = false;
	let w = 0;
	let h = 0;

	onMount(() => {
		const img = new Image();
		img.src = path;
		loading = true;
		w = img.naturalWidth;
		h = img.naturalHeight;

		img.onload = () => {
			loading = false;
			loaded = true;
		};
		img.onerror = () => {
			loading = false;
			failed = true;
		};
	});
</script>

{#if loaded}
	<img src={path} {alt} class="img-fluid d-inline-block" />
{:else if failed}
	<p>error při načítání obrázku</p>
{:else if loading}
	<div class="placeholder" style="width: {w}px;height: {h}px;"><p class="neue text-center">načítám obrázek</p></div>
{/if}

<style>
	.placeholder {
		background-color: black;
        color:white;
        max-height: 20vh;
        max-width: 20vw;
	}
</style>
