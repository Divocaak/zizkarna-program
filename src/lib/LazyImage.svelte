<script>
	import { onMount } from 'svelte';
	import { FxReveal as Img } from '@zerodevx/svelte-img';

	export let path;
	export let alt = '';
	export let additionalClasses = '';
	export let disabled = false;
	export let offsetY = 0;
	export let offsetYSm = 0;

	const src = {
		sources: {
			jpeg:`${path} 1920w, ${path} 1024w, ${path} 480w`
		},
		img: { src: path, w: 1920, h: 1080 }
	};

	let ref, loaded;
	onMount(() => {
		if (ref.complete) loaded = true;
	});

	let innerWidth = 0;
	$: condition = innerWidth < 800;
</script>

<svelte:window bind:innerWidth/>

<div class="wrap">
	<Img
		{src}
		class="my-img {additionalClasses}{disabled ? " disabled" : ""}"
		style="top:{condition ? offsetYSm : offsetY}px; "
		{alt}
		bind:ref
		on:load={() => (loaded = true)}
	/>
	<div class="blur" class:loaded />
</div>

<style>
	:globa(.my-img) {
		--reveal-transform: scale(1.02);
		--reveal-transition: opacity 1s ease-in, transform 0.8s ease-out;
		--reveal-filter: blur(20px);
	}

	.wrap {
		position: relative;
		overflow: hidden;
	}
	.blur {
		position: absolute;
		inset: 0;
		backdrop-filter: blur(20px);
		pointer-events: none;
	}
	.loaded {
		display: none;
	}

	:global(.disabled) {
		filter: saturate(0%);
	}
</style>
