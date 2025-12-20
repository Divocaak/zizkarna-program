import { User } from '$lib/classes/user';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    // Restore user from session cookie
    const session = event.cookies.get('session');
    event.locals.user = session ? User.fromJSON(JSON.parse(session)) : null;

    const pathname = event.url.pathname;

    // Pages that don't require login
    const authPages = ['/admin/login', '/admin/register', '/admin/401', '/admin/403'];
    if (authPages.includes(pathname)) return resolve(event);

    // Protect all /admin routes
    if (pathname.startsWith('/admin')) {
        // Not logged in → redirect to login
        if (!event.locals.user) throw redirect(302, '/admin/login');

        const user = event.locals.user;

        // Admin landing page does not require permissions
        if (pathname === '/admin' || pathname === "/admin/logout") return resolve(event);

        // Analytics section check
        if (pathname.startsWith('/admin/analytics') && !user.isAnalytics()) throw redirect(302, '/admin/403');
        // Users admin section check
        if (pathname.startsWith('/admin/users') && !user.isUsersAdmin()) throw redirect(302, '/admin/403');

        // All other admin pages require admin privilege
        if (!pathname.startsWith('/admin/analytics') &&
            !pathname.startsWith('/admin/users') &&
            !user.isAdmin()) throw redirect(302, '/admin/403');
    }

    return resolve(event);
}
