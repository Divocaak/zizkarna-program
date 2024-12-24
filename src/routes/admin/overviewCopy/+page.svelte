<script>
	import { CopyText } from '$lib/classes/copyText.js';

	let { form } = $props();
	const copyTextElement = new CopyText();
	if (form) {
		const monthText = form.label.charAt(0).toUpperCase() + form.label.slice(1);
		let copyText = `🗓️ ${monthText} v Žižkárně!\n\n`;
		Object.values(form.events).flatMap((currentEvent) => {
			copyText += new Date(currentEvent.date).toLocaleDateString('cs-CZ', {});
			copyText += ` - ${currentEvent.label}`;

			let profiles = '';
			currentEvent.bands.forEach((band) => {
				if (!band.instagramProfile) return;
				profiles += `@${band.instagramProfile} `;
			});

			copyText += `${profiles != '' ? `\n${profiles}` : ''}\n\n`;
		});
		copyText +=
			'ℹ️ Podrobnější informace k jednotlivým akcím najdete na https://program.zizkarna.cz/';
		copyTextElement.setContent(copyText);
	}

	const date = new Date();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	const year = date.getFullYear();
</script>

<h1>generátor textace k měsíčnímu přehledu</h1>
<a href="/admin">zpět</a><br />
<br />
<form method="POST">
	<label for="selectedDate">
		měsíc
		<input type="month" id="selectedDate" name="selectedDate" value="{year}-{month}" required />
	</label>
	<br /><br />
	<button type="submit">generate</button>
</form>

<br />

{#if form}
	<button onclick={copyTextElement.copyText()}>copy to clipboard</button>
	{@html copyTextElement.getContentStyled()}
{/if}
