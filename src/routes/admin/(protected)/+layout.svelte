<script>
	import { User } from '$lib/classes/user.js';

	export let data;
	const user = User.fromJSON(data.user);
</script>

<p>
	{@html user.getInfoString()}
	<a href="/admin/logout">Odhlásit se</a>
	<br />
	(práva: {#each user.privileges as privilege}
		{privilege.id}: <b>{privilege.label}</b>,&nbsp;
	{/each})
</p>

<slot />

<style lang="scss">
	:global(code) {
		background-color: #cccccc;
	}

	:global(table) {
		border-collapse: collapse;
	}

	:global(td) {
		border: 1.5px solid black;
		padding: 5px;
	}

	:global(tr:nth-child(even)) {
		background-color: #696969;
	}

	:global(body) {
		background-color: #212529;
		color: #dee2e6;
	}

	:global(a) {
		color: #6495ed;
	}

	:global(input, textarea) {
		background-color: darkgrey;
	}
</style>