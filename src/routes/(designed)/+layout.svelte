<script>
	import Analytics from '$lib/Analytics.svelte';
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
		content="hudba, kultura, akce, budějce, české, budějovice, žižkárna, koncerty, trhy, kapely, farmářské, program, workshop, divadlo, party, dj, koncerty, dhogh, muzika, ehmk, brownfield, eventy, industrial, hipster, populární, music, zizkarna, events, actual, popular, live, show, bar, drink, beer, pivo, shots, culture"
	/>
	<meta name="author" content="Vojtěch Divoký" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<!-- Facebook Pixel Code -->
	<script>
		!(function (f, b, e, v, n, t, s) {
			if (f.fbq) return;
			n = f.fbq = function () {
				n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
			};
			if (!f._fbq) f._fbq = n;
			n.push = n;
			n.loaded = !0;
			n.version = '2.0';
			n.queue = [];
			t = b.createElement(e);
			t.async = !0;
			t.src = v;
			s = b.getElementsByTagName(e)[0];
			s.parentNode.insertBefore(t, s);
		})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '369158252412072');
		fbq('track', 'PageView');
	</script>
	<noscript>
		<img
			alt="fbpixelimg"
			height="1"
			width="1"
			src="https://www.facebook.com/tr?id=369158252412072&ev=PageView&noscript=1"
		/>
	</noscript>
	<!-- End Facebook Pixel Code -->
</svelte:head>

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
			<a class="nav-item nav-link neue" href="/info">Info</a>
		</div>
	</div>
</nav>
<slot />
<Analytics />

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

	@font-face {
		font-family: 'Karla';
		src: url('/Karla-VariableFont_wght.ttf');
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

	:global(.karla) {
		font-family: 'Karla', sans-serif;
	}
</style>
