<script>
	export let data;
</script>

<h1>analytics events</h1>
<a href="/admin/analytics">zpět</a><br />

<table class="admin-table" style="margin-top:20px">
	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col">datum</th>
			<th scope="col">název</th>
			<th scope="col">celkem (místo/předprodej/guest)</th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each data.events as event}
			<tr>
				<td>
					<a href="/{event.id}"><b>{event.id}</b></a>
				</td>
				<td>
					{new Date(event.date).toLocaleDateString('cs-CZ', {})}
				</td>
				<td>
					{event.label}
				</td>
				<td>
					{event.total} ({event.onSite ?? 0} / {event.presale ?? 0} / {event.guest ?? 0})
				</td>
				<td>
					<a href="/admin/analytics/list/edit/{event.id}">upravit</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
