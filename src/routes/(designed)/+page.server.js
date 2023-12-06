export const load = async ({ params, fetch }) => {

    const result = await fetch("/api/eventsAll");
    const data = await result.json();

    //const today = new Date("2023-12-01T18:03:00Z").toISOString();
    const today = new Date("2023-07-07").toISOString();
    let past = data;
    let future = [];
    let close = [];
    past.forEach(event => {
        if (event.date < today){
            console.log("past: " + event.label);
            return;
        }
        
        past.splice(past.indexOf(event), 1);

        if (close.length < 3) {
            console.log("close: " + event.label);
            close.push(event);
            return;
        }
        
        console.log("future: " + event.label);
        future.push(event);
    });

    console.log("---");
    console.log("all");
    console.log(data.length);
    console.log("future");
    console.log(future.length);
    console.log("past");
    console.log(past.length);
    console.log("close");
    console.log(close.length);

    return {
        events: []
    }
}