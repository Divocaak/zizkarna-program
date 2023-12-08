<script>
	import { onMount } from 'svelte';

	export let label, date, doors;

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://cdn.addevent.com/libs/atc/1.6.1/atc.min.js';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);
	});

	const dateDate = new Date(date);
	const year = dateDate.getFullYear();
	const month = (dateDate.getMonth() + 1).toString().padStart(2, '0');
	const day = dateDate.getDate().toString().padStart(2, '0');
	const dateToUse = day + '/' + month + '/' + year;
</script>

<div title="Přidat do mého kalendáře" class="addeventatc">
	Přidat do mého kalendáře
	<span class="start">{dateToUse + doors}</span>
	<span class="end">{dateToUse}</span>
	<span class="date_format">DD/MM/YYYY</span>
	<span class="timezone">Europe/Prague</span>
	<span class="title">Žižkárna: {label}</span>
	<span class="location">
		Žižkárna, Žižkova tř. 171/28, České Budějovice 6, 370 04 České Budějovice, Česko
	</span>
</div>