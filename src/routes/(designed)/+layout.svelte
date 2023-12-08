<script>
	/* import Analytics from '$lib/Analytics.svelte';
	var adsBlockerNotPresent = true; */
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css"
	/>
	<link
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css"
		rel="stylesheet"
		integrity="sha384-aFq/bzH65dt+w6FI2ooMVUpc+21e0SRygnTpmBvdBgSdnuTN7QbdgL+OapgHtvPp"
		crossorigin="anonymous"
	/>
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N"
		crossorigin="anonymous"
	></script>

	<meta charset="windows-1250" />
	<meta
		name="keywords"
		content="hudba, kultura, akce, budějce, české, budějovice, žižkárna, koncerty, trhy, kapely, farmářské, program, workshop, divadlo, party, dj, koncerty, dhogh, muzika, ehmk, brownfield, eventy, industrial, hipster, populární, music, zizkarna, events, actual, popular"
	/>
	<meta name="author" content="Vojtěch Divoký" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<!-- {#if adsBlockerNotPresent === undefined}
	<p>ad block detected</p>
{:else}
	<Analytics />
{/if} -->
<nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
	<a class="navbar-brand ps-5 neue-bold d-flex align-items-center" href="/">
		<img
			src="/logo.svg"
			width="40"
			height="40"
			class="d-inline-block align-top me-3"
			alt="žižkárna logo"
			style="filter:invert(100%);"
			loading="lazy"
		/>
		Žižkárna program
	</a>
	<button
		class="navbar-toggler"
		type="button"
		data-bs-toggle="collapse"
		data-bs-target="#navbarNavAltMarkup"
		aria-controls="navbarNavAltMarkup"
		aria-expanded="false"
		aria-label="Toggle navigation"
	>
		<span class="navbar-toggler-icon" />
	</button>
	<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
		<div class="pe-5 navbar-nav ms-auto">
			<a class="nav-item nav-link neue" href="/#closest">Nejbližší akce</a>
			<a class="nav-item nav-link neue" href="/#future">Na co se můžete těšit</a>
			<a class="nav-item nav-link neue" href="/#older">Uplynulé akce</a>
			<div class="d-none d-md-block border-start border-1 mx-1" />
			<a class="nav-item nav-link neue" href="/zztv">žžTV</a>
			<div class="d-none d-md-block border-start border-1 mx-1" />
			<a class="nav-item nav-link neue" href="/info">Dramaturgie</a>
		</div>
	</div>
</nav>
<slot />

<style lang="scss">
	@font-face {
		font-family: 'NeueMachina';
		src: url('/neueMachina/NeueMachina-Regular.otf');
	}

	@font-face {
		font-family: 'NeueMachina';
		src: url('/neueMachina/NeueMachina-Ultrabold.otf');
		font-weight: bold;
	}

	:global(html) {
		scroll-behavior: smooth;
		overflow-x: hidden;
	}

	:global(.neue) {
		font-family: 'NeueMachina', 'Courier New', monospace;
	}

	:global(.neue-bold) {
		font-family: 'NeueMachina', 'Courier New', monospace;
		font-weight: bold;
	}
</style>
