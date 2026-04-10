<script>
	import { onMount, onDestroy } from 'svelte';

	export let src;
	export let alt = '';
	export let placeholder = '/placeholder.jpg';
	export let className = '';
	export let disabled = false;

	let imgSrc = null;
	let loaded = false;
	let failed = false;

	let container;
	let observer;

	// setup observer
	onMount(() => {
		if (!container) return;

		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					imgSrc = src;
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);

		observer.observe(container);
	});

	onDestroy(() => {
		observer?.disconnect();
	});

	// reset when src changes
	$: if (src) {
		loaded = false;
		failed = false;
		imgSrc = null;

		// re-observe when src changes
		if (container && observer) {
			observer.observe(container);
		}
	}
</script>

<div bind:this={container} class="wrap">
	{#if imgSrc}
		<img
			src={failed ? placeholder : imgSrc}
			{alt}
			class={`img ${className} ${loaded ? 'loaded' : ''} ${disabled ? 'disabled' : ''}`}
			on:load={() => (loaded = true)}
			on:error={() => {
				if (!failed) {
					failed = true;
				}
			}}
		/>
	{:else}
		<div class="skeleton"></div>
	{/if}
</div>

<style>
	.wrap {
		position: relative;
		overflow: hidden;
	}

	.img {
		width: 100%;
		height: auto;
		display: block;
		filter: blur(20px);
		transform: scale(1.02);
		transition:
			filter 0.6s ease,
			transform 0.6s ease,
			opacity 0.4s ease;
		opacity: 0.6;
	}

	.img.loaded {
		filter: blur(0);
		transform: scale(1);
		opacity: 1;
	}

	.skeleton {
		width: 100%;
		padding-top: 56.25%; /* 16:9 ratio */
		background: #eee;
	}

	.disabled {
		filter: grayscale(100%) blur(0) !important;
	}
</style>
