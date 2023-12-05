export const load = async ({params, fetch}) => {

    const result = await fetch("/api/eventsAll");
    const data = await result.json();

    console.log(data);
    /* data.forEach(event => {
        console.log(event);
        console.log(event.date);
    }); */

    return {
        events: data
    }
}