<script>
	const Types = {
		YouTube: 'YouTube',
		Spotify: 'Spotify',
		AppleMusic: 'Apple Music',
		Other: 'Jiný odkaz'
	};

	export let link;

	// NOTE tvar https://[něco podle čeho switch]/
	// lomeno na konci nutné!

	let type;
	let tmp = link.substring(8, link.length);
	switch (tmp.substring(0, tmp.indexOf('/'))) {
		case 'youtu.be':
			type = Types.YouTube;
			break;
		case 'sptfy.com':
			type = Types.Spotify;
			break;
		case 'music.apple.com':
			type = Types.AppleMusic;
			break;
		default:
			type = Types.Other;
			break;
	}
</script>

{#if type == Types.YouTube}
	<a href={link} class="btn btn-outline-secondary mt-1 me-1 yt" target="_blank"
		><i class="bi bi-youtube pe-2" />{type}</a
	>
{:else if type == Types.Spotify}
	<a href={link} class="btn btn-outline-secondary mt-1 me-1 spotify" target="_blank"
		><i class="bi bi-spotify pe-2" />{type}</a
	>
{:else if type == Types.AppleMusic}
	<a href={link} class="btn btn-outline-secondary mt-1 me-1 applemusic" target="_blank">
		<i class="bi bi-music-note-beamed pe-2" />{type}
	</a>
{:else}
	<a href={link} class="btn btn-outline-secondary mt-1 me-1" target="_blank">
		<i class="bi bi-link-45deg pe-2" />{type} ({tmp})
	</a>
{/if}

<style>
	.yt,
	.yt:active,
	.yt:visited,
	.yt:focus {
		border-color: #ff0000;
		color: #ff0000;
	}

	.yt:hover {
		background-color: #ff0000;
		color: #f8f9fa;
	}

	.spotify,
	.spotify:active,
	.spotify:visited,
	.spotify:focus {
		border-color: #1db954;
		color: #1db954;
	}

	.spotify:hover {
		background-color: #1db954;
		color: #f8f9fa;
	}

	.applemusic,
	.applemusic:active,
	.applemusic:visited,
	.applemusic:focus {
		border-color: #f94c57;
		color: #f94c57;
	}

	.applemusic:hover {
		background-color: #f94c57;
		color: #f8f9fa;
	}
</style>
