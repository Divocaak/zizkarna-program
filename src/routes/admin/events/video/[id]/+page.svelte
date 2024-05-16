<script>
	import { writable } from 'svelte/store';
	export let data;

	const isLoading = writable(null);
	const isImage = writable(false);

	const selectedEvent = data.event;
	const eventTags = data.eventTags;
	const bands = data.bands ?? [];

	const selectedBand = writable(null);
	async function selectBand(newBand) {
		const res = await fetch('/dynamic/bands/' + newBand.id + '/band.json');
		const data = res.ok ? await res.json() : { imgs: [], links: [] };
		newBand.imgs = data.imgs || [];

		selectedBand.set(newBand);
	}

	const timeFormatted = (time) => time.substring(0, time.length - 3);

	const getTagsString = (tags) =>
		tags
			.map((tag) => tag.label)
			.join('')
			.replaceAll('////', '//');

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = Object.fromEntries(new FormData(event.target));

		try {
			isLoading.set(true);

			const dateFormatted = new Date(selectedEvent.date).toLocaleDateString('cs-CZ', {
				month: 'numeric',
				day: 'numeric',
				weekday: 'long'
			});

			const response = await fetch('/api/videoGenerator/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					testFrame: formData.submitType ?? null,
					eventId: selectedEvent.id,
					eventLabel: formData.eventLabel,
					eventTags: formData.eventTags,
					bandLabel: $selectedBand.label,
					bandDesc: formData.bandDescription,
					bandTags: formData.bandTags,
					bandImage: formData.selectedImg,
					bandStageTime: `Stage time: ${timeFormatted($selectedBand.stageTime)}`,
					doors: `otevřeno od ${timeFormatted(selectedEvent.doors)}`,
					date: dateFormatted,
					tickets: formData.eventTickets ?? null
				})
			});

			// TODO rewrite to use new responses
			const result = await response.json();

			isLoading.set(false);
			isImage.set(result.img);

			return result.path;
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isLoading.set(false);
		}
	}
</script>

<h1>generátor ig story videa</h1>
<a href="/admin/events">zpět</a><br /><br />
<form method="POST" on:submit={handleSubmit}>
	<label for="eventLabel">
		event label
		<input
			type="text"
			id="eventLabel"
			name="eventLabel"
			maxlength="128"
			required
			value={selectedEvent.label}
			style="width: 500px;"
		/>
	</label><br />
	<label for="eventTags">
		event tags<br />
		<textarea
			type="text"
			id="eventTags"
			name="eventTags"
			maxlength="1024"
			cols="100"
			rows="2"
			required>{getTagsString(eventTags)}</textarea
		>
	</label><br />
	{#if selectedEvent.tickets}
		<label for="eventTickets">
			event tickets<br />
			link: {selectedEvent.tickets}
			<input
				type="text"
				id="eventTickets"
				name="eventTickets"
				maxlength="128"
				required
				value={selectedEvent.tickets != null ? 'Předprodej v síti GoOut' : ''}
				style="width: 500px;"
			/>
		</label><br />
	{/if}
	<br />band select<br />
	{#each bands as band}
		<input
			on:change={() => selectBand(band)}
			type="radio"
			id={band.id}
			name="selectedBand"
			value={band}
			required
		/>
		<label for={band.id}>{band.label}</label><br />
	{/each}<br />
	{#if $selectedBand !== null}
		<label for="bandDescription">
			band bio<br />
			<textarea
				type="text"
				id="bandDescription"
				name="bandDescription"
				maxlength="1024"
				cols="100"
				rows="5"
				required>{$selectedBand.description}</textarea
			>
		</label><br />
		<label for="bandTags">
			band tags<br />
			<textarea
				type="text"
				id="bandTags"
				name="bandTags"
				maxlength="1024"
				cols="100"
				rows="2"
				required>{getTagsString($selectedBand.tags)}</textarea
			>
		</label><br />
		{#each $selectedBand.imgs as img}
			<div class="img-select">
				<input type="radio" id={img} name="selectedImg" value="{$selectedBand.id}/{img}" required />
				<img src="/dynamic/bands/{$selectedBand.id}/{img}" alt="band img {img}" />
			</div>
		{/each}
	{/if}
	<label for="testFrameEvent">
		<input type="radio" id="testFrameEvent" name="submitType" value="event" />
		test frame <b>event</b> section
	</label><br />
	<label for="testFrameBand">
		<input type="radio" id="testFrameBand" name="submitType" value="band" />
		test frame <b>band</b> section
	</label><br />
	<br /><button type="submit">generate</button>
</form>

<br />
{#if $isLoading}
	ʕ•ᴥ•ʔ (generuju, sorry, trvá mi to, vydrž pls)
{:else if $isLoading === null}
	(ᵔᴥᵔ)
{:else}
	<!-- prettier-ignore -->
	{#if $isImage}
		<img src="/dynamic/generator/testFrame.png" alt="test frame" width="342" height="607"/>
	{:else}
		<a href="/dynamic/generator/video.mp4" target="_blank" download="video.mp4">stáhnout video</a><br />
		<!-- svelte-ignore a11y-media-has-caption -->
		<video width="342" height="607" autoplay loop>
			<source src="/dynamic/generator/video.mp4" type="video/mp4" />
		</video><br />
	{/if}
{/if}

<style>
	video {
		border: 2px solid green;
	}

	img {
		border: 2px solid red;
	}

	.img-select {
		padding: 5px 0px;
		display: flex;
	}

	.img-select img {
		height: 100px;
		width: auto;
		border: none;
	}
</style>
