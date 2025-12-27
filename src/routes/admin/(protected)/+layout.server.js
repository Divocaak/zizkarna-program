export function load({ locals }) {
    return { user: locals.user?.toJSON() ?? null };
}