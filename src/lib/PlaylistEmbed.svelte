<script>
	export let title = 'Youtube Playlist';
	export let src = '';
</script>

<iframe
	class="col-12 col-md-6"
	{src}
	{title}
	height="300vh"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	frameborder="0"
	allowfullscreen
/>
