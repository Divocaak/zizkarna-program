import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
    if (!locals.user?.isAnalytics()) {
        throw redirect(302, '/admin/403');
    }
}
