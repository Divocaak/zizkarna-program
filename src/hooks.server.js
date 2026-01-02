import { User } from '$lib/classes/user';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    let user = null;

    try {
        const session = event.cookies.get('session');
        if (session) user = User.fromJSON(JSON.parse(session));
    } catch {
        event.cookies.delete('session', { path: '/' });
    }

    event.locals.user = user;

    // Only run guards for actual pages
    if (!event.route?.id) return resolve(event);

    const pathname = event.url.pathname;

    // Skip API
    if (pathname.startsWith('/api')) return resolve(event);

    // Public admin pages
    if (
        pathname === '/admin/login' ||
        pathname === '/admin/register' ||
        pathname === '/admin/401' ||
        pathname === '/admin/403'
    ) {
        return resolve(event);
    }

    if (pathname.startsWith('/admin')) {
        if (!user) throw redirect(302, '/admin/login');

        if (pathname === '/admin' || pathname === '/admin/logout')
            return resolve(event);

        if (pathname.startsWith('/admin/analytics') && !user.isAnalytics())
            throw redirect(302, '/admin/403');

        if (pathname.startsWith('/admin/users') && !user.isUsersAdmin())
            throw redirect(302, '/admin/403');

        if (
            !pathname.startsWith('/admin/analytics') &&
            !pathname.startsWith('/admin/users') &&
            !user.isAdmin()
        ) {
            throw redirect(302, '/admin/403');
        }
    }

    return resolve(event);
}
