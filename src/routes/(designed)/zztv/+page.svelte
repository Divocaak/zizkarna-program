<script>
	import PlaylistEmbed from '$lib/PlaylistEmbed.svelte';
	import BandLinkButton from '$lib/buttons/BandLinkButton.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>žžTV</title>
	<meta name="description" content="Informace o projektu žžTV" />
</svelte:head>

<div class="p-5">
	<h1 class="display-1 text-center neue-bold">žžTV</h1>
	<p class="karla">
		Chybí Ti nezapomenutelná atmosféra z nějakého koncertu, který se u nás odehrál? Nebo si chceš
		jenom poslechnout tu kapelu, která Tě tak strašně moc bavila, ale bohužel nemá žádné nahrávky?
		Tak odebírej Žižkárnu na YouTube, kde si můžeš téměř každý koncert užít znovu!
		<br /><br />
		Upozorňujeme, že na této stránce nemusí být zobrazena všechna nahraná videa, proto doporučujeme kanál
		odebírat :)
	</p>
	<div class="text-center">
		<BandLinkButton link="https://youtube.com/@Zizkarna" isZizkarnaTV={true} />
	</div>
</div>

<div class="row g-0 mx-0 mx-md-5 pb-5">
	{#each data.events as event}
		<PlaylistEmbed
			src="https://www.youtube.com/embed/videoseries?list={event.youtube.split(
				'playlist?list='
			)[1]}"
			title={event.label}
		/>
	{/each}
</div>
