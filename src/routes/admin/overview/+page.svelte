<script>
	import { writable } from 'svelte/store';

	const isLoading = writable(null);
	const isMonth = writable(true);
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

			const apiPath = $isMonth
				? `/api/events/listOverviewMonth?year=${year}&month=${monthOrWeek}`
				: `/api/events/listOverviewWeek?year=${year}&week=${monthOrWeek}`;
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

			const response = await fetch('/api/overviewGenerator/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ events: eventsData, outputFormat: formData.outputFormat })
			});

			const result = await response.json();

			isLoading.set(false);

			return 'pls'; //result.path;
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
			checked
		/>
		ig post <b>měsíc</b>
	</label><br />
	<label for="outputFormatMonthStory">
		<input
			on:change={() => changeOutput(true)}
			type="radio"
			id="outputFormatMonthStory"
			name="outputFormat"
			value="monthStory"
			required
		/>
		ig story <b>měsíc</b> <i>(vyškrtaný)</i>
	</label><br />
	<label for="outputFormatWeek">
		<input
			on:change={() => changeOutput(false)}
			type="radio"
			id="outputFormatWeek"
			name="outputFormat"
			value="week"
			required
		/>
		ig story <b>týden</b>
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
	{:else}
		<label for="week">
			týden
			<input type="week" id="week" name="selectedDate" required value={currentWeek} />
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
	<!-- <img src="/dynamic/generator/testFrame.png" alt="test frame" width="342" height="607" /> -->
{/if}

<style>
	img {
		border: 2px solid red;
	}
</style>
