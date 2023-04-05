<script>
	export let link;
	export let type = null;
	export let label;
</script>

{#if type == 'youtube'}
	<a href={link} class="btn btn-outline-secondary me-1 yt"
		><i class="bi bi-youtube pe-2" />{label}</a
	>
{:else if type == 'spotify'}
	<a href={link} class="btn btn-outline-secondary me-1 spotify"><i class="bi bi-spotify pe-2" />{label}</a>
{:else if type == 'applemusic'}
	<a href={link} class="btn btn-outline-secondary me-1 applemusic">
		<i class="bi bi-music-note-beamed pe-2" />{label}
	</a>
{:else}
	<a href={link} class="btn btn-outline-secondary me-1">
		<i class="bi bi-link-45deg pe-2" />{label}
	</a>
{/if}

<style>
	.yt,
	.yt:active,
	.yt:visited,
	.yt:focus {
        border-color: #ff0000;
        color:#ff0000;
	}
    
    .yt:hover{
        background-color: #ff0000;
        color: #f8f9fa;
    }

	.spotify,
	.spotify:active,
	.spotify:visited,
	.spotify:focus {
        border-color: #1db954;
        color:#1db954;
	}
    
    .spotify:hover{
        background-color: #1db954;
        color: #f8f9fa;
    }

	.applemusic,
	.applemusic:active,
	.applemusic:visited,
	.applemusic:focus {
        border-color: #f94c57;
        color:#f94c57;
	}
    
    .applemusic:hover{
        background-color: #f94c57;
        color: #f8f9fa;
    }
</style>
