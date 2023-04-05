<script>
    export let event;
    import 'add-to-calendar-button';
</script>

<div class="mt-1">
    <i class="bi bi-google pe-2">
        <add-to-calendar-button
            name={event.label}
            options="Google"
            location="Žižkárna"
            startDate={event.date}
            endDate={event.date}
            startTime={event.doors}
            endTime="23:59"
            timeZone="Europe/Prague"
            buttonStyle="date"
            listStyle="modal"
            language="cs"
            size="2"
            hideCheckmark
            inline
        />
    </i>
    <i class="bi bi-apple pe-2">
        <add-to-calendar-button
            name={event.label}
            options="Apple"
            location="Žižkárna"
            startDate={event.date}
            endDate={event.date}
            startTime={event.doors}
            endTime="23:59"
            timeZone="Europe/Prague"
            buttonStyle="date"
            listStyle="modal"
            language="cs"
            size="2"
            hideCheckmark
            inline
        />
    </i>
</div>