<script>
	export let tag;
</script>

<span
	class="badge bg-secondary mx-1 neue"
	style="background-color:#{tag.bgColor}!important;color:#{tag.textColor}!important;border:2.5px solid #{tag.textColor};"
>
	{tag.label}
</span>
