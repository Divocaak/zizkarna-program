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

	:global(body){
		background-color: #212529;
		color: #dee2e6;
	}

	:global(a){
		color:#6495ED;
	}

	:global(input, textarea){
		background-color: darkgrey
	}
</style>
