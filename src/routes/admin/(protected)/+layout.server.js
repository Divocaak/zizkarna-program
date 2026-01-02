export const load = ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/admin/login');
    }

    return {
        user: locals.user.toJSON()
    };
};