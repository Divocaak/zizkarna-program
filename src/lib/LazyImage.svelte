<script>
	import { onMount } from 'svelte';
	import { FxReveal as Img } from '@zerodevx/svelte-img';

	/**
	 * @typedef {Object} Props
	 * @property {any} path
	 * @property {string} [alt]
	 * @property {string} [additionalClasses]
	 * @property {boolean} [disabled]
	 */

	/** @type {Props} */
	let {
		path,
		alt = '',
		additionalClasses = '',
		disabled = false
	} = $props();

	const src = {
		img: { src: path, w: 1920, h: 1080 },
		sources: {
			webp: [
				{ src: path, w: 1920 },
				{ src: path, w: 1024 },
				{ src: path, w: 480 }
			],
			jpeg: [
				{ src: path, w: 1920 },
				{ src: path, w: 1024 },
				{ src: path, w: 480 }
			]
		}
	};

	let ref = $state(), loaded = $state();
	onMount(() => {
		if (ref.complete) loaded = true;
	});
</script>

<div class="wrap">
	<Img
		{src}
		class="my-img {additionalClasses}{disabled ? " disabled" : ""}"
		{alt}
		bind:ref
		on:load={() => (loaded = true)}
	/>
	<div class="blur" class:loaded></div>
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
