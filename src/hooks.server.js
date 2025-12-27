import { User } from '$lib/classes/user';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    // Restore user safely
    let user = null;
    try {
        const session = event.cookies.get('session');
        if (session) user = User.fromJSON(JSON.parse(session));
    } catch (e) {
        console.error('Invalid session cookie', e);
        event.cookies.delete('session', { path: '/' });
    }

    event.locals.user = user;
    const pathname = event.url.pathname;

    // Skip auth for API routes
    if (pathname.startsWith('/api')) return resolve(event);
    if (pathname.startsWith('/.well-known')) return resolve(event);

    // Only protect actual page navigations
    const isPageRequest = event.request.headers.get('accept')?.includes('text/html');
    if (!isPageRequest) return resolve(event);

    const authPages = [
        '/admin/login',
        '/admin/register',
        '/admin/401',
        '/admin/403'
    ];
    if (authPages.includes(pathname)) return resolve(event);

    if (pathname.startsWith('/admin')) {
        if (!user) throw redirect(302, '/admin/login');

        if (pathname === '/admin' || pathname === '/admin/logout') return resolve(event);
        if (pathname.startsWith('/admin/analytics') && !user.isAnalytics()) throw redirect(302, '/admin/403');
        if (pathname.startsWith('/admin/users') && !user.isUsersAdmin()) throw redirect(302, '/admin/403');

        if (
            !pathname.startsWith('/admin/analytics') &&
            !pathname.startsWith('/admin/users') &&
            !user.isAdmin()
        ) throw redirect(302, '/admin/403');
    }

    return resolve(event);
}
