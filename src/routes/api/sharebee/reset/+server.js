import dbSharebees from '$lib/db/sharebees';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    return new Response();
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform }) {
    return new Response();
    // try {
    //     if (!platform) {
    //         return new Response(JSON.stringify({ error: 'Missing platform' }), {
    //             status: 400,
    //             headers: { 'Content-Type': 'application/json' }
    //         });
    //     }
    //     const db = dbSharebees(platform.env.DB);
    //     const success = await db.resetSharebees();
    //     if (!success) {
    //         return new Response(JSON.stringify({ error: 'Failed to reset sharebees' }), {
    //             status: 500,
    //             headers: { 'Content-Type': 'application/json' }
    //         });
    //     }

    //     return new Response(JSON.stringify({ success: true }), {
    //         status: 200,
    //         headers: { 'Content-Type': 'application/json' }
    //     });
    // } catch (error) {
    //     return new Response(JSON.stringify({ error: 'Server error' }), {
    //         status: 500,
    //         headers: { 'Content-Type': 'application/json' }
    //     });
    // }
}