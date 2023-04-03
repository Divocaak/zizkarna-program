<script>
	export var event;
	export var tags;

    import viewport from './useViewportAction';
	import { fade, fly } from 'svelte/transition';

	var dateFormatted = new Date(event.date).toLocaleDateString('cs-CZ', {});
</script>

<div
	use:viewport
	on:enterViewport={() => animate}
	on:exitViewport={() => console.log(event.label + ' exit!')}
	class="row d-flex justify-content-center mx-5 px-5"
	in:fly={{ y: 200, duration: 2000 }}
	out:fade
>
	<div class="col">
		<img
			class="img-fluid"
			src="/imgs/{event.thumbnail != null ? event.thumbnail : 'placeholder.png'}"
			alt="event thumbnail"
		/>
	</div>
	<div class="col">
		<h1 class="neue-bold">{event.label}</h1>
		{#each event.tags as tag}
			<span
				class="badge bg-secondary mx-1 neue"
				style="background-color:{tags[tag].bgColor}!important;color:{tags[tag]
					.textColor}!important;"
			>
				{tags[tag].label}
			</span>
		{/each}
		<hr class="border-2" />
		<p class="neue"><i class="bi bi-calendar-event pe-2" />{dateFormatted}</p>
		<p class="neue"><i class="bi bi-ticket-perforated pe-2" />{event.cash},-&nbsp;Kč</p>
		<p class="neue"><i class="bi bi-door-open pe-2" />{event.doors}</p>
		<hr class="border-2" />
		<a
			href={event.fbEvent}
			class="btn btn-outline-primary neue"
			class:disabled={event.fbEvent == null}
		>
			<i class="pe-2 bi bi-facebook" />Událost {event.fbEvent != null ? '' : ' již brzy'}
		</a>
		{#if event.tickets != null}
			<a href={event.tickets} class="btn btn-outline-secondary neue"
				><i class="pe-2 bi bi-ticket-perforated-fill" />Předprodej lístků</a
			>
		{/if}
	</div>
</div>

<style>
	@font-face {
		font-family: 'NeueMachina';
		src: url('/neueMachina/NeueMachina-Regular.otf');
	}

	@font-face {
		font-family: 'NeueMachina';
		src: url('/neueMachina/NeueMachina-Ultrabold.otf');
		font-weight: bold;
	}

	.neue {
		font-family: 'NeueMachina';
	}

	.neue-bold {
		font-family: 'NeueMachina';
		font-weight: bold;
	}
</style>
