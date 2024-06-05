<script>
	import videoPreview from '$lib/stores/videoPreviewStore.js';
	
	let storeValue;
	videoPreview.subscribe((value) => {
		storeValue = value;
	});
</script>

{@html $videoPreview}
