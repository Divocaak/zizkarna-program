<script>
	export var event;
	export var tags;

	import Saos from 'saos';
	import ShareButton from './ShareButton.svelte';
    import { page } from '$app/stores';

	var dateFormatted = new Date(event.date).toLocaleDateString('cs-CZ', {});
</script>

<Saos
	animation={'from-left 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}
	animation_out={'to-right 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}
	top={200}
	bottom={50}
>
	<div class="row d-flex justify-content-center mx-5 px-5">
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
			<a href="" class="btn btn-outline-info neue"><i class="bi bi-info-circle pe-2" />Chci víc</a>
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
			<div class="mt-1">
				<ShareButton url="{$page.path}/" text="Přijď do Žižkárny na {event.label}"/>
				<a href="" class="btn btn-outline-secondary neue"
					><i class="bi bi-calendar-plus pe-2" />Přidat do kalendáře</a
				>
			</div>
		</div>
	</div>
</Saos>

<style>
	@keyframes -global-from-left {
		0% {
			transform: rotateX(50deg) translateX(-200vw) skewX(-50deg);
			opacity: 1;
		}
		100% {
			transform: rotateX(0deg) translateX(0) skewX(0deg);
			opacity: 1;
		}
	}

	@keyframes -global-to-right {
		0% {
			transform: rotateX(0deg) translateX(0vw) skewX(0deg);
			opacity: 1;
		}
		100% {
			transform: rotateX(-50deg) translateX(200vw) skewX(50deg);
			opacity: 1;
		}
	}

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
