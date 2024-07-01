<script>
	import { writable } from 'svelte/store';
	export let data;

	const isLoading = writable(null);

	const selectedEvent = data.event;
	const eventTags = data.eventTags;
	const bands = data.bands ?? [];

	const selectedBand = writable(null);
	async function selectBand(newBand) {
		const res = await fetch(`/dynamic/bands/${newBand.id}/band.json`);
		const data = res.ok ? await res.json() : { imgs: [], links: [] };
		newBand.imgs = data.imgs || [];
		bandTags.set(getTagsString(newBand.tags));
		selectedBand.set(newBand);
	}

	const testFrame = writable(false);
	const changeTestFrame = () => testFrame.set(!$testFrame);

	const timeFormatted = (time) => time.substring(0, time.length - 3);

	const getTagsString = (tags) =>
		tags
			.map((tag) => tag.label)
			.join('')
			.replaceAll('////', '//');

	const bandTags = writable(null);
	const formData = writable({
		eventLabel: selectedEvent.label,
		eventTags: getTagsString(eventTags),
		selectedImg: null,
		testFrameNumber: 3.7,
		tickets: selectedEvent.tickets ? 'Předprodej v síti GoOut' : null
	});

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			isLoading.set(true);

			const dateFormatted = new Date(selectedEvent.date).toLocaleDateString('cs-CZ', {
				month: 'numeric',
				day: 'numeric',
				weekday: 'long'
			});

			const requestPath = '/api/videoGenerators/bandInEvent';
			const requestBody = {
				testFrame: $testFrame ? $formData.testFrameNumber : null,
				eventId: selectedEvent.id,
				eventLabel: $formData.eventLabel,
				eventTags: $formData.eventTags,
				bandLabel: $selectedBand.label,
				bandDesc: $selectedBand.description,
				bandTags: $bandTags,
				bandImage: $formData.selectedImg,
				bandStageTime: `Stage time: ${timeFormatted($selectedBand.stageTime)}`,
				doors: `otevřeno od ${timeFormatted(selectedEvent.doors)}`,
				date: dateFormatted,
				tickets: $formData.tickets ?? null
			};

			if ($testFrame) {
				window.open(
					`/admin/videoPreview?data=${encodeURIComponent(
						JSON.stringify({ requestBody: requestBody, requestPath: requestPath })
					)}`,
					'_blank'
				);
				return;
			}

			const response = await fetch(requestPath, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestBody)
			});

			const result = await response.json();
			isLoading.set(false);
			return;
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
			style="width: 500px;"
			bind:value={$formData.eventLabel}
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
			required
			bind:value={$formData.eventTags}
		/>
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
				style="width: 500px;"
				bind:value={$formData.tickets}
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
			required
			value={band}
			bind:group={$formData.selectedBand}
		/>
		<label for={band.id}>{band.label}</label><br />
	{/each}<br />
	{#if $selectedBand}
		<label for="bandDescription">
			band bio<br />
			<textarea
				type="text"
				id="bandDescription"
				name="bandDescription"
				maxlength="1024"
				cols="100"
				rows="5"
				required
				bind:value={$selectedBand.description}
			/>
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
				required
				bind:value={$bandTags}
			/>
		</label><br />
		{#each $selectedBand.imgs as img}
			<div class="img-select">
				<input
					type="radio"
					id={img}
					name="selectedImg"
					value="{$selectedBand.id}/{img}"
					required
					bind:group={$formData.selectedImg}
				/>
				<label for={img}>
					<img src="/dynamic/bands/{$selectedBand.id}/{img}" alt="band img {img}" />
				</label>
			</div>
		{/each}
	{/if}
	<label for="testFrame">
		<input
			on:change={() => changeTestFrame()}
			type="checkbox"
			id="testFrame"
			name="testFrame"
			bind:checked={$testFrame}
		/>
		test frame
	</label><br />
	{#if $testFrame}
		<label for="testFrameNumber">
			test frame <i>(<b>0.8</b> event, <b>3.7</b> band)</i>
			<input
				type="number"
				step="0.1"
				id="testFrameNumber"
				name="testFrameNumber"
				bind:value={$formData.testFrameNumber}
			/>
		</label><br />
	{/if}
	<br /><button type="submit">generate</button>
</form>

<br />
{#if $isLoading}
	ʕ•ᴥ•ʔ (generuju, sorry, trvá mi to, vydrž pls)
{:else if $isLoading === null}
	(ᵔᴥᵔ)
{:else}
	<a href="/dynamic/generator/output.mp4" target="_blank" download="output.mp4">stáhnout video</a><br />
	<!-- svelte-ignore a11y-media-has-caption -->
	<video width="342" height="607" autoplay loop>
		<source src="/dynamic/generator/output.mp4" type="video/mp4" />
	</video><br />
{/if}

<style>
	video {
		border: 2px solid green;
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
