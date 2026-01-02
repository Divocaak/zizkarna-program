<script>
	import { version } from '$app/environment';

	let login = '';
	let password = '';
	let error = '';

	async function handleSubmit(event) {
		event.preventDefault();
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login, password })
		});

		if (response.ok) {
			window.location.href = '/admin';
		} else {
			const data = await response.json();
			error = data.message;
		}
	}
</script>

<form on:submit={handleSubmit} autocomplete="off" >
	<label for="login">Login</label>
	<input id="login" type="text" bind:value={login} required /><br />

	<label for="password">Heslo</label>
	<input id="password" type="password" bind:value={password} required /><br />

	{#if error}
		<p style="color: red;">{error}</p>
		<br />
	{/if}

	<button type="submit">Přihlásit se</button><br />
	<a href="/admin/register">Registrovat se</a><br />
</form>

<p class="signature">
	Designed, coded & maintained by
	<a href="https://divokyvojtech.cz/" target="_blank">Vojtěch Divoký</a><br />
	build:&nbsp;{version}
</p>

<style>
	.signature {
		position: absolute;
		bottom: 0;
		width: calc(100% - 100px);
		text-align: end;
		font-size: small;
	}
</style>
