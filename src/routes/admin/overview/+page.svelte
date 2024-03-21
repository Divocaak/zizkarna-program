<script>
	import { writable } from 'svelte/store';

	const isLoading = writable(null);
	const isImage = writable(false);
	const isMonth = writable(false);
	const changeOutput = (newVal) => isMonth.set(newVal);

	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = ('0' + (now.getMonth() + 1)).slice(-2);
	const currentWeek = now.getFullYear() + '-W' + getWeekNumber(now).toString().padStart(2, '0');

	function getWeekNumber(d) {
		d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
		return weekNo;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = Object.fromEntries(new FormData(event.target));

		try {
			isLoading.set(true);

			const year = formData.selectedDate.substring(0, 4);
			const monthOrWeek = formData.selectedDate.substring(
				formData.selectedDate.length - 2,
				formData.selectedDate.length
			);

			/* NOTE */
			const apiPath = `/api/events/listOverviewMonth?year=2023&month=9`; /* $isMonth
				? `/api/events/listOverviewMonth?year=${year}&month=${monthOrWeek}`
				: `/api/events/listOverviewWeek?year=${year}&week=${monthOrWeek}`; */
			const events = await fetch(apiPath);
			let eventsData = await events.json();
			eventsData.forEach((event) => {
				const eventDate = new Date(event.date);
				event.past = eventDate < now;
				event.date = eventDate.toLocaleDateString('cs-CZ', {
					month: 'numeric',
					day: 'numeric',
					weekday: 'long'
				});
			});

			const label = $isMonth
				? new Date(2000, monthOrWeek - 1, 1)
						.toLocaleString('cs-CZ', { month: 'long' })
						.toUpperCase()
				: 'TENTO TÝDEN';

			const response = await fetch('/api/overviewGenerator/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					events: eventsData,
					label: label,
					outputFormat: formData.outputFormat,
					dimPast: formData.dimPast,
					testFrame: formData.testFrame,
					/* NOTE */
					halfSplit: true // formData.halfSplit
				})
			});

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

<h1>generátor přehledů</h1>
<a href="/admin">zpět</a><br />
<br />
<form method="POST" on:submit={handleSubmit}>
	<label for="outputFormatMonth">
		<input
			on:change={() => changeOutput(true)}
			type="radio"
			id="outputFormatMonth"
			name="outputFormat"
			value="month"
			required
		/>
		celý měsíc
	</label><br />
	<label for="outputFormatWeek">
		<input
			on:change={() => changeOutput(false)}
			type="radio"
			id="outputFormatWeek"
			name="outputFormat"
			value="week"
			required
			checked
		/>
		týden
	</label><br />
	<br />
	{#if $isMonth === true}
		<label for="month">
			měsíc
			<input
				type="month"
				id="month"
				name="selectedDate"
				required
				value={`${currentYear}-${currentMonth}`}
			/>
		</label><br />
		<label for="halfSplit">
			<input type="checkbox" id="halfSplit" name="halfSplit" />
			rozdělit v půlce na dvě části
		</label><br />
	{:else}
		<label for="week">
			týden
			<input type="week" id="week" name="selectedDate" required value={currentWeek} />
		</label><br />
	{/if}
	<br />
	<label for="dimPast">
		<input type="checkbox" id="dimPast" name="dimPast" checked />
		zatmavit uplynulé akce
	</label><br />
	<label for="testFrame">
		<input type="checkbox" id="testFrame" name="testFrame" />
		testframe
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
	img {
		border: 2px solid red;
	}
</style>
