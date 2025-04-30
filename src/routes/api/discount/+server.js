import { json } from '@sveltejs/kit';

/** @type {{ [key: string]: number }} */
const discounts = {
	'livelaughraptor': 25,
	'idunnohowtariffswork': 50
}
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { discountCode } = await request.json();

	const discount = discounts[discountCode]
	if (discount) {
		return json({ discountCode, discount });
	}

	return json({ discountCode, discount: 0 });
}
