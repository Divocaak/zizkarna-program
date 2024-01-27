<script>
	import { onMount } from 'svelte';
	import AnalyticsButtonWrapper from './AnalyticsButtonWrapper.svelte';

	export let label, date, doors;
	export let card = false;

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

<AnalyticsButtonWrapper event="add-to-calendar" data={{ eventLabel: label }} fromCard={card} classes={"mt-1"}>
	<div title="Přidat do mého kalendáře" class="addeventatc">
		<p class="karla">Přidat do mého kalendáře</p>
		<span class="start">{dateToUse + doors}</span>
		<span class="end">{dateToUse}</span>
		<span class="date_format">DD/MM/YYYY</span>
		<span class="timezone">Europe/Prague</span>
		<span class="title">Žižkárna: {label}</span>
		<span class="location">
			Žižkárna, Žižkova tř. 171/28, České Budějovice 6, 370 04 České Budějovice, Česko
		</span>
	</div>
</AnalyticsButtonWrapper>

<style>
	.addeventatc {
		z-index: 1;
		box-shadow: none !important;
		outline: 1px solid darkseagreen;
		padding: 0.6rem 1.2rem;
	}

	.addeventatc p {
		padding: 0;
		margin: 0;
		padding-left: 1.25rem;
		padding-top: 0.25rem;
		color: darkseagreen;
	}

	.addeventatc:hover {
		background-color: darkseagreen;
		transition: all ease-in-out 0.15s;
	}
	.addeventatc:hover p {
		color: whitesmoke;
	}
</style>
