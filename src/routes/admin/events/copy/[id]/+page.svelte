<script>
	export let data;
	const event = data.event;
	const bands = data.bands ?? [];

	function timeFormat(time) {
		return time.substring(0, time.length - 3);
	}

	const dateFormatted = new Date(event.date)
		.toLocaleDateString('cs-CZ', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
		.replaceAll(' ', '');

	const urlToEvent = event.fbEvent != null ? event.fbEvent : 'www.program.zizkarna.cz/' + event.id;

	function removeLastSlashes(tag) {
		return tag.substring(0, tag.length - 2);
	}

	const copyToClipboard = (toCopy) => {
		navigator.clipboard.writeText(toCopy);
	};
</script>

<a href="/admin/events">zpět</a>
<p>{dateFormatted} - {event.label} // Žižkárna</p>
<p>
	<b
		>od čáry dolů zkopírovat celé do popisu události, kopírovací srandy pro <a
			href="www.inbudejovice.cz">inbudejovice</a
		> jsou pod další čárou</b
	>
</p>
<hr />
<p>
	{#each data.eventTags as tag}
		{removeLastSlashes(tag.label)}
	{/each}
	//
</p>
{#if event.description != null}
	<p>{event.description}</p>
{/if}
<p>👉 více informací na https://program.zizkarna.cz/{event.id}?from=copy</p>
{#each bands as band}
	<p>
		// {band.label}<br />
		{#if band.tags.length != 0}
			{#each band.tags as tag}
				{removeLastSlashes(tag.label)}
			{/each} //
			<br />
		{/if}
		{#if band.description != '' && band.description != ' ' && band.description != null}
			{band.description}<br />
		{/if}
		{#each band.links as link}
			🔘 {link}<br />
		{/each}
	</p>
{/each}
{#if event.tickets != null}<p>🎫 Předprodej za {event.presalePrice} Kč: {event.tickets}</p>{/if}
<p>🎟️ Vstup na místě: {event.cash} Kč</p>
<p>
	// Harmonogram<br />
	🚪 {timeFormat(event.doors)} otevření Žižkárny<br />
	{#each bands as band}
		{#if !band.isCoorganiser}
			{timeFormat(band.stageTime)} {band.label}<br />
		{/if}
	{/each}
	<br />
	⚠️ Dovolujeme si upozornit, že časy jsou pouze orientační a mohou se změnit
</p>
<!-- inbudejovice form data to copy -->
<hr />
<a href="https://www.inbudejovice.cz/pridat-akci">přidávací formulář</a><br /><br />
<b>Název</b>
<p>
	{event.label}
	<button on:click={() => copyToClipboard(event.eventLabel)}>kopírovat</button>
</p>

<b>Místo konání</b>
<p>
	Žižkárna, Žižkova třída 28, Č. Budějovice (Vedle OC MERCURY)
	<button
		on:click={() => copyToClipboard('Žižkárna, Žižkova třída 28, Č. Budějovice (Vedle OC MERCURY)')}
		>kopírovat</button
	>
</p>

<b>Datum</b>
<p>
	{dateFormatted}
	<button on:click={() => copyToClipboard(dateFormatted)}>kopírovat</button>
</p>

<b>Čas</b>
<p>
	{timeFormat(event.doors)}
	<button on:click={() => copyToClipboard(timeFormat(event.doors))}>kopírovat</button>
</p>

<b>Popis</b>
<div style="background-color:lightgrey">
	<p>{event.description}</p>
	{#each bands as band}
		<p>
			// {band.label}<br />
			{#if band.description != '' && band.description != ' ' && band.description != null}{band.description}<br
				/>{/if}
			{#each band.links as link}{link}<br />{/each}
		</p>
	{/each}
</div>

<b>Plakát nebo obrázek k akci</b>
<a href="/dynamic/events/{data.id}.jpg" target="_blank" download="{data.id}.jpg">stáhnout grafiku</a
><br /><br />

<b>Kategorie</b>
<p>(nelze generalizovat)</p>

<b>Přístupnost</b>
<p>Bezbariérový přístup <span style="background-color:limegreen">ANO</span></p>
<p>Vstup se zvířaty <span style="background-color:limegreen">povolen</span></p>

<b>Kontaktní informace</b>
<p>
	722680481
	<button on:click={() => copyToClipboard('722680481')}>kopírovat</button>
</p>
<p>
	vojtech@zizkarna.cz
	<button on:click={() => copyToClipboard('vojtech@zizkarna.cz')}>kopírovat</button>
</p>

<b>Vstupné</b>
<p>
	{event.cash}
	<button on:click={() => copyToClipboard(event.cash)}>kopírovat</button>
</p>

<b>Pořadatel</b>
<p>
	Žižkárna z.s.
	<button on:click={() => copyToClipboard('Žižkárna z.s.')}>kopírovat</button>
</p>

<b>Zdroj dat</b>
<p>
	www.program.zizkarna.cz/{event.id}
	<button on:click={() => copyToClipboard('www.program.zizkarna.cz/' + event.id)}>kopírovat</button>
</p>

<b>Odkaz na akci</b>
<p>
	{urlToEvent}
	<button on:click={() => copyToClipboard(urlToEvent)}>kopírovat</button>
</p>
<p>
	(funguje dynamicky, pokud existuje událost, nabídne odkaz na událost, pokud ne, nabídne odkaz na
	program)
</p>

{#if event.tickets != null}
	<b>Rezervace vstupenek</b>
	<p>
		{event.tickets}
		<button on:click={() => copyToClipboard(event.tickets)}>kopírovat</button>
	</p>
{/if}
