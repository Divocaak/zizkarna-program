import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
    if (!locals.user?.isOsa()) {
        throw redirect(302, '/admin/403');
    }
}
