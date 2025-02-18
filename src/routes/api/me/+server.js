import dbOrders from '$lib/db/orders';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({cookies, platform}) {

    const token = cookies.get('token');
    if (!token) {
        return new Response(null, { status: 401 });
    }

    const { phoneNumber } = await platform?.env.AUTH_SERVICE.authorizeToken(token);
    if (!phoneNumber) {
        return new Response(null, { status: 401 });
    }

    const orders = await dbOrders(platform?.env.DB).getOrdersByPhoneNumber(phoneNumber);
    const freebee = await platform?.env.DB.prepare(`SELECT * FROM freebees WHERE winner = ?`).bind(phoneNumber).first()

    return json({phoneNumber, orders, freebee});
}