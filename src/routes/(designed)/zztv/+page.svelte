<script>
	import PlaylistEmbed from '$lib/PlaylistEmbed.svelte';
	import BandLinkButton from '$lib/buttons/BandLinkButton.svelte';
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
		<BandLinkButton link="https://youtube.com/@Zizkarna" isZizkarnaTV={true}/>
	</div>
</div>

<div class="row g-0 mx-0 mx-md-5 pb-5">
	<PlaylistEmbed
		src="https://www.youtube.com/embed/videoseries?si=owvQHwSLPWAt4-3S&amp;list=PLSMl48OPZBRQqW-bxONpgHA81M6YXktNa"
		title="Bob Kubert & Beach Bum & What's In The Box // Žižkárna"
	/>
	<PlaylistEmbed
		src="https://www.youtube.com/embed/videoseries?si=8zyxC_yCiF8LNUhf&amp;list=PLSMl48OPZBRTfdDjZYWSI5Y6VmEn7lLCV"
		title="Marcel Gidote’s Holy Crab & kapela Matěj // Žižkárna"
	/>
	<PlaylistEmbed
		src="https://www.youtube.com/embed/videoseries?si=yQspWYFp1KAYCdZH&amp;list=PLSMl48OPZBRQfHlLFl27c587Ri4qgjiXo"
		title="Pozdravy z Polepšovny tour - Anna Vaverková + Loukty v Říji + Ryan O'Reilly // Žižkárna"
	/>
	<PlaylistEmbed
		src="https://www.youtube.com/embed/videoseries?si=9PShMSGVvw6YVPuM&amp;list=PLSMl48OPZBRRGu8LTVQY1y53nRPKI4as8"
		title="Aiko & Ménière // Žižkárna"
	/>
	<PlaylistEmbed
		src="https://www.youtube.com/embed/videoseries?si=fo-yFUkYv2RRirja&amp;list=PLSMl48OPZBRQXCDAGGsq-49fhWw3s7NJ5"
		title="Žižkárenská Punková Odysea: Chaotik Panik, Res Publica Porcos, Demo Version, Zkouška Rázem // Žižkárna"
	/>
	<PlaylistEmbed
		src="https://www.youtube.com/embed/videoseries?si=pkAAFpznaMoshZau&amp;list=PLSMl48OPZBRQSMIDY_pExN-PvN2j84Ivo"
		title="ČBxHC: Halloween párty, Dog Feed, TOSH, Demoversion // Žižkárna"
	/>
</div>
