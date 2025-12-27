<script>
	export let data;
</script>

<h2>Uživatelé</h2>
<a href="/admin">Zpět</a><br />

<table class="admin-table">
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Login</th>
			<th scope="col">Celé jméno</th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each data.users as user}
			<tr>
				<td>
					{user.id}
				</td>
				<td>
					{user.login}
				</td>
				<td>
					<b>{user.l_name}</b>
					{user.f_name}
				</td>
				<td>
					<a href="/admin/users/privileges?uid={user.id}">Práva</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
