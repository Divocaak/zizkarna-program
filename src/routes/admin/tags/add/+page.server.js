import { ADMIN_PASSWORD } from "$env/static/private";

/** @type {import('./$types').Actions} */
export const actions = {
    default: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());
        if(formData.password !== ADMIN_PASSWORD) return "špatné heslo";
        return "uloženo";
        /* let res = await fetch('formdata', {
            method: 'post',
            headers: {        
              'content-type': 'application/json'
              },
            body: 'test'
          })' */
    }
};