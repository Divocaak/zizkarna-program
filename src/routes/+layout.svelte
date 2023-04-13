<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&family=Roboto:wght@300;400;500&family=Unbounded:wght@400;500;700;800&display=swap"
		rel="stylesheet"
	/>
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
</svelte:head>

<nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
	<a class="navbar-brand ps-5 neue-bold d-flex align-items-center" href="/">
		<img src="/logo.svg" width="40" height="40" class="d-inline-block align-top me-3" alt="logo svg" style="filter:invert(100%);">
		Žižkárna program
	  </a>
	<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
	  <span class="navbar-toggler-icon"></span>
	</button>
	<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
	  <div class="pe-5 navbar-nav ms-auto">
		<a class="nav-item nav-link neue" href="/#closest">Nejbližší akce</a>
		<a class="nav-item nav-link neue" href="/#future">Na co se můžete těšit</a>
		<a class="nav-item nav-link neue" href="/#older">Uplynulé akce</a>
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
	:root {
		--yellow: #f9d204;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(.neue) {
		font-family: 'NeueMachina';
	}

	:global(.neue-bold) {
		font-family: 'NeueMachina';
		font-weight: bold;
	}
</style>
