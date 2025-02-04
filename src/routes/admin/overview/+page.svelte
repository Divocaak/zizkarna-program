<script>
	import { writable } from 'svelte/store';

	const isLoading = writable(null);
	const isImage = writable(null);

	const isOfflineMedium = writable(false);
	const changeOutputMediumPoster = (newVal) => isOfflineMedium.set(newVal);

	const testFrame = writable(false);
	const changeTestFrame = () => testFrame.set(!$testFrame);

	const date = new Date();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	const year = date.getFullYear();

	const formData = writable({
		outputRange: 'month',
		selectedDate: `${year}-${month}`,
		outputMediumOrVidLength: '8',
		dimPastEvents: true,
		splitForTwoSections: false,
		testFrameNumber: 1
	});

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			isLoading.set(true);

			const isMonth = $formData.outputRange == 'month';
			const selectedDate = $formData.selectedDate;
			const monthOrWeek = selectedDate.substring(selectedDate.length - 2, selectedDate.length);
			const year = selectedDate.substring(0, 4);

			const label = isMonth
				? new Date(2000, monthOrWeek - 1, 1)
						.toLocaleString('cs-CZ', { month: 'long' })
						.toUpperCase()
				: 'TENTO TÝDEN';

			const isPoster = $isOfflineMedium;

			let requestPath = '/api/videoGenerators/';
			let pathEndpoint = 'overviewsThumbnails';
			let requestBody = {
				testFrame: $testFrame ? $formData.testFrameNumber : null,
				label: label
			};

			if ($formData.outputMediumOrVidLength === 'thumbnail') {
				requestBody.label += ` ${year}`;
			} else {
				pathEndpoint = 'overviews';
				const apiPath = isMonth
					? `/api/events/listOverviewMonth?year=${year}&month=${monthOrWeek}`
					: `/api/events/listOverviewWeek?year=${year}&week=${monthOrWeek}`;
				const events = await fetch(apiPath);
				const eventsData = await events.json();

				requestBody = {
					...requestBody,
					...{
						outputMediumOrVidLength: $formData.outputMediumOrVidLength,
						dimPastEvents: isPoster ? false : $formData.dimPastEvents,
						splitForTwoSections: isPoster ? false : $formData.splitForTwoSections,
						events: eventsData,
						isPoster: isPoster
					}
				};
			}
			requestPath += `${pathEndpoint}/`;

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
			isImage.set(result.format == 'image');
			return;
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isLoading.set(false);
		}
	}
</script>

<h1>generátor přehledů</h1>
<a href="/admin">zpět</a><br />
<br />
<form method="POST" on:submit={handleSubmit}>
	<label for="outputFormatWeek">
		<input
			type="radio"
			id="outputFormatWeek"
			name="outputFormat"
			value="week"
			required
			bind:group={$formData.outputRange}
		/>
		týden
	</label><br />
	<label for="outputFormatMonth">
		<input
			type="radio"
			id="outputFormatMonth"
			name="outputFormat"
			value="month"
			required
			bind:group={$formData.outputRange}
		/>
		celý měsíc
	</label>

	<br /><br />

	<label for="selectedDate">
		{#if $formData.outputRange === 'month'}
			měsíc
			<input
				type="month"
				id="selectedDate"
				name="selectedDate"
				required
				bind:value={$formData.selectedDate}
			/>
		{:else}
			týden
			<input
				type="week"
				id="selectedDate"
				name="selectedDate"
				required
				bind:value={$formData.selectedDate}
			/>
		{/if}
	</label>

	<br /><br />

	<label for="outputDurationThumbnail">
		<input
			on:change={() => changeOutputMediumPoster(true)}
			type="radio"
			id="outputDurationThumbnail"
			name="outputDuration"
			value="thumbnail"
			required
			bind:group={$formData.outputMediumOrVidLength}
		/>
		0 sekund (reel thumbnail, 1080x1920px)
	</label><br />
	<label for="outputDurationPoster">
		<input
			on:change={() => changeOutputMediumPoster(true)}
			type="radio"
			id="outputDurationPoster"
			name="outputDuration"
			value="a4"
			required
			bind:group={$formData.outputMediumOrVidLength}
		/>
		0 sekund, a4 (2480x3508px), 300 PPI/DPI (plakát)
	</label><br />
	<label for="outputDurationTarp">
		<input
			on:change={() => changeOutputMediumPoster(true)}
			type="radio"
			id="outputDurationTarp"
			name="outputDuration"
			value="b0"
			required
			bind:group={$formData.outputMediumOrVidLength}
		/>
		0 sekund, b0 (11811x16701px), 300 PPI/DPI (plachta (venkovní tabule))
	</label><br />
	<label for="outputDurationStory">
		<input
			on:change={() => changeOutputMediumPoster(false)}
			type="radio"
			id="outputDurationStory"
			name="outputDuration"
			value="8"
			required
			checked
			bind:group={$formData.outputMediumOrVidLength}
		/>
		8 sekund (story, 1080x1920px)
	</label><br />
	<label for="outputDurationReel">
		<input
			on:change={() => changeOutputMediumPoster(false)}
			type="radio"
			id="outputDurationReel"
			name="outputDuration"
			value="15"
			required
			bind:group={$formData.outputMediumOrVidLength}
		/>
		15 sekund (reel, 1080x1920px)
	</label>

	<br /><br />

	{#if !$isOfflineMedium}
		<label for="dimPastEvents">
			<input
				type="checkbox"
				id="dimPastEvents"
				name="dimPastEvents"
				bind:checked={$formData.dimPastEvents}
			/>
			zatmavit uplynulé akce
		</label><br />
		<label for="splitForTwoSections">
			<input
				type="checkbox"
				id="splitForTwoSections"
				name="splitForTwoSections"
				bind:checked={$formData.splitForTwoSections}
			/>
			rozdělit v půlce na dvě části
		</label>

		<br /><br />
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
			test frame in seconds
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
	<!-- prettier-ignore -->
	{#if $isImage === null}
		<a href="/dynamic/generator/output.mp4" target="_blank" download="output.mp4">stáhnout video</a><br />
		<!-- svelte-ignore a11y-media-has-caption -->
		<video width="342" height="607" autoplay loop>
			<source src="/dynamic/generator/output.mp4" type="video/mp4" />
		</video><br />
	{:else}
		<a href="/dynamic/generator/output.jpg" target="_blank" download="output.jpg">stáhnout grafiku</a><br />
		<img src="/dynamic/generator/output.jpg" alt="test frame" width="342" height="607"/>
	{/if}
{/if}

<style>
	video {
		border: 2px solid green;
	}

	img {
		border: 2px solid red;
	}
</style>
