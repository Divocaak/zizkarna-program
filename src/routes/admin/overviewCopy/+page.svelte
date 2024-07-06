<script>
	export let form;
	let copyText = "";
	if (form) {
		const monthText = form.label.charAt(0).toUpperCase() + form.label.slice(1);
		copyText = `🗓️ ${monthText} v Žižkárně!\n\n`;
		
		Object.values(form.events).flatMap((currentEvent) => {
			copyText += new Date(currentEvent.date).toLocaleDateString('cs-CZ', {});
			copyText += ` - ${currentEvent.label}`;
			
			let profiles = "";
			currentEvent.bands.forEach((band) => {
				if(!band.instagramProfile) return;
				profiles += `@${band.instagramProfile} `;
			});
			
			copyText += `${profiles != "" ? `\n${profiles}` : ""}\n\n`;
		});
		copyText += "ℹ️ Podrobnější informace k jednotlivým akcím najdete na https://program.zizkarna.cz/";
	}
</script>

<h1>generátor textace k měsíčnímu přehledu</h1>
<a href="/admin">zpět</a><br />
<br />
<form method="POST">
	<label for="selectedDate">
		měsíc
		<!-- TODO default value -->
		<input type="month" id="selectedDate" name="selectedDate" value="2023-04" required />
	</label>
	<br /><br />
	<button type="submit">generate</button>
</form>

<br />

{#if copyText !== ""}<p>{copyText}</p>{/if}

<style>
	p{
		white-space: pre-line;
	}
</style>