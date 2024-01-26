<script>
	import AnalyticsButtonWrapper from '$lib/buttons/AnalyticsButtonWrapper.svelte';

	const Types = {
		YouTube: 'YouTube',
		Spotify: 'Spotify',
		AppleMusic: 'Apple Music',
		Facebook: 'Facebook',
		Instagram: 'Instagram',
		SoundCloud: 'SoundCloud',
		Other: 'Jiný odkaz'
	};

	export let link;
	export let eventLabel;
	export let bandName;

	let type;
	let tmp = link.substring(8, link.length);
	switch (tmp.substring(0, tmp.indexOf('/'))) {
		case 'youtu.be':
		case 'youtube.com':
			type = Types.YouTube;
			break;
		case 'open.spotify.com':
			type = Types.Spotify;
			break;
		case 'music.apple.com':
			type = Types.AppleMusic;
			break;
		case 'facebook.com':
			type = Types.Facebook;
			break;
		case 'instagram.com':
			type = Types.Instagram;
			break;
		case 'soundcloud.com':
			type = Types.SoundCloud;
			break;
		default:
			type = Types.Other;
			break;
	}

	const typeData = {
		[Types.YouTube]: { icon: 'bi-youtube', class: 'yt' },
		[Types.Spotify]: { icon: 'bi-spotify', class: 'spotify' },
		[Types.AppleMusic]: { icon: 'bi-music-note-beamed', class: 'applemusic' },
		[Types.Facebook]: { icon: 'bi-facebook', class: 'facebook' },
		[Types.Instagram]: { icon: 'bi-instagram', class: 'instagram' },
		[Types.SoundCloud]: { icon: 'bi-cloud-fill', class: 'soundcloud' }
	};

	const typeInfo = typeData[type] || { icon: 'bi-link-45deg', class: '' };
</script>

<AnalyticsButtonWrapper event="band-link" data={{eventLabel: eventLabel, bandName: bandName, linkType: type, link: link}}>
	<a href={link} class="btn btn-outline-secondary mt-1 me-1 {typeInfo.class} karla" target="_blank">
		<i class="bi {typeInfo.icon} pe-2" />{type === Types.Other ? tmp : type}
	</a>
</AnalyticsButtonWrapper>

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

	.facebook,
	.facebook:active,
	.facebook:visited,
	.facebook:focus {
		border-color: #3b5998;
		color: #3b5998;
	}

	.facebook:hover {
		background-color: #3b5998;
		color: #f8f9fa;
	}

	.instagram,
	.instagram:active,
	.instagram:visited,
	.instagram:focus {
		border-color: #bc2a8d;
		color: #bc2a8d;
	}

	.instagram:hover {
		background-color: #bc2a8d;
		color: #f8f9fa;
	}

	.soundcloud,
	.soundcloud:active,
	.soundcloud:visited,
	.soundcloud:focus {
		border-color: #ff7700;
		color: #ff7700;
	}

	.soundcloud:hover {
		background-color: #ff7700;
		color: #f8f9fa;
	}
</style>
