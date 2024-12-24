<script>
	let { tag } = $props();
</script>

<span
	class="badge mx-1 neue"
	style="background-color:#{tag.bgColor}!important;color:#{tag.textColor}!important;border:2.5px solid #{tag.textColor};"
>
	{tag.label}
</span>
