<script>
	let { date } = $props();
	let dateFormatted = new Date(date).toLocaleDateString('cs-CZ', {
		month: 'numeric',
		day: 'numeric',
		weekday: 'long'
	});
</script>

<p class="karla"><i class="bi bi-calendar-event pe-2"></i>{dateFormatted}</p>
