<script>
	import BandLinkButton from '$lib/buttons/BandLinkButton.svelte';
</script>

<svelte:head>
	<title>Dramaturgie</title>
	<meta name="description" content="Kontakt na dramaturgii" />
</svelte:head>

<div class="text-center my-5">
	<h2 class="pt-5 neue-bold">Odkazy</h2>
	<p class="karla lead">Sledujte nás na sociálních sítích:</p>
	<BandLinkButton
		link={'https://instagram.com/zizkarna/'}
		eventLabel={'zz-info-page'}
		bandName={'zizkarna'}
	/>
	<BandLinkButton
		link={'https://facebook.com/zizkarnacb'}
		eventLabel={'zz-info-page'}
		bandName={'zizkarna'}
	/>
	<BandLinkButton link={'https://zizkarna.cz/'} eventLabel={'zz-info-page'} bandName={'zizkarna'} />
	<h2 class="pt-5 neue-bold">Dramaturgie a produkce Žižkárny</h2>
	<p class="lead karla">
		Vojtěch Divoký<br />
		<a class="link-secondary" href="mailto:vojtech@zizkarna.cz">
			<i class="bi bi-envelope pe-2" />vojtech@zizkarna.cz
		</a>
		<!-- <a class="link-secondary" href="tel:722680481">
			<i class="bi bi-telephone pe-2" />722&nbsp;680&nbsp;481
		</a> -->
	</p>
	<h2 class="pt-5 neue-bold">Pro promotéry</h2>
	<p class="karla">
		Logo Žižkárny (<i>.svg</i> a <i>.png</i>) pro použití na plakátech a grafikách lze stáhnout
		<a
			class="text-muted karla"
			href="https://drive.google.com/drive/folders/13tpyB-pHEA3KqaPG3sJChPRgNj3QJ7cc?usp=sharing"
			target="_blank">zde</a
		>.
	</p>
	<a class="text-muted karla" href="/about.pdf" target="_blank"
		>Prezentace o Žižkárně (pouze v angličtině) / Presentation about Žižkárna (English only)</a
	>
	<h2 class="pt-5 neue-bold">Kde nás najdete</h2>
	<p class="karla lead">a jak se k nám dostanete</p>
	<div class="row pt-3 mx-5">
		<div class="col-12 col-md-6">
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10476.080353545329!2d14.485373999999998!3d48.972142!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47734f8fb6d689ab%3A0x30873f0fb4b41a4c!2zxb1pxb5rw6FybmE!5e0!3m2!1scs!2scz!4v1711467283774!5m2!1scs!2scz"
				width="400"
				height="300"
				class="map"
				allowfullscreen=""
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				title="map"
			/>
		</div>
		<div class="col-12 col-md-6">
			<p class="karla text-muted text-start">
				Žižkova třída 28,<br />
				Č. Budějovice,<br />
				vjezd z ulice <i>Žižkova tř.</i>
			</p>
		</div>
	</div>
	<br />
	<div class="mt-5 pt-5">
		<a class="text-muted karla" href="/changelog">changelog webu</a>
	</div>
</div>

<style>
	.map{
		border:0;
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>