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
		background-color: lightgrey;
	}
</style>
