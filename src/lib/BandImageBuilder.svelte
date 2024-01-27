<script>
	import LazyImage from '$lib/LazyImage.svelte';

	export let imgs = [];
	export let id = '';
	export let bandName = '';

	const colA = [];
	const colB = [];
	const colC = [];

	for (let i = 0; i < imgs.length; i++) {
		[colA, colB, colC][i % 3].push(imgs[i]);
	}
</script>

<div class="cols-wrapper my-4 pb-5">
	<div class="image-column">
		{#each colA as path}
			<LazyImage
				path={`/dynamic/bands/${id}/${path}`}
				alt="fotka {bandName} číslo {path}"
				additionalClasses="img-fluid column-img "
			/>
		{/each}
	</div>
	<div class="image-column">
		{#each colB as path}
			<LazyImage
				path={`/dynamic/bands/${id}/${path}`}
				alt="fotka {bandName} číslo {path}"
				additionalClasses="img-fluid column-img "
			/>
		{/each}
	</div>
	<div class="image-column">
		{#each colC as path}
			<LazyImage
				path={`/dynamic/bands/${id}/${path}`}
				alt="fotka {bandName} číslo {path}"
				additionalClasses="img-fluid column-img "
			/>
		{/each}
	</div>
</div>

<style>
	.cols-wrapper {
		display: flex;
		flex-wrap: wrap;
		padding: 0;
	}

	.image-column {
		flex: 33;
		max-width: 33%;
		padding: 0 .1rem;
	}

	:global(.column-img) {
		margin-top: .2rem !important;
		vertical-align: middle;
		width: 100%;
	}

	@media screen and (max-width: 600px) {
		.image-column {
			flex: 100%;
			max-width: 100%;
		}
	}
</style>
