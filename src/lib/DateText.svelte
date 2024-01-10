<script>
	export let date;
	let dateFormatted = new Date(date).toLocaleDateString('cs-CZ', {
		month: 'numeric',
		day: 'numeric',
		weekday: 'long'
	});
</script>

<p class="neue"><i class="bi bi-calendar-event pe-2" />{dateFormatted}</p>
