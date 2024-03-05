<script>
	import { writable } from 'svelte/store';

	const isLoading = writable(null);
	const isMonth = writable(true);
	const changeOutput = (newVal) => isMonth.set(newVal);

	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = ('0' + (now.getMonth() + 1)).slice(-2);

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = Object.fromEntries(new FormData(event.target));

        console.log(formData);

		/* try {
			isLoading.set(true);

			const response = await fetch('/api/videoGenerator/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({})
			});

			const result = await response.json();

			isLoading.set(false);

			return result.path;
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isLoading.set(false);
		} */
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
		ig story <b>měsíc</b> <i>vyškrtaný</i>
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
				name="selectedData"
				required
				value={`${currentYear}-${currentMonth}`}
			/>
		</label><br />
	{:else}
		<label for="week">
			týden
            <!-- TODO default value -->
			<input type="week" id="week" name="selectedData" required/>
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
	<img src="/dynamic/generator/testFrame.png" alt="test frame" width="342" height="607" />
{/if}

<style>
	img {
		border: 2px solid red;
	}
</style>
