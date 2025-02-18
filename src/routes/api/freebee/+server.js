import dbFreebees from '$lib/db/freebees';
import { concatDateTime, dateAndTimeToDateZ } from '$lib/utils';
import { json } from '@sveltejs/kit';

let freebeeConfig = {
	id: 'freebee-1',
	project_name: 'raptor-faight-2',
	nextFreebeeDate: '2025-02-15',
	nextFreebeeTime: '12:00:00'
};
/** @type {import('cookie').CookieSerializeOptions & {path: string}} */
const cookieOptions = {
	path: '/',
	expires: new Date('2100-01-01'),
	secure: true, // Only sent over HTTPS
	httpOnly: true, // Not accessible via JavaScript
	sameSite: 'lax' // Protects against CSRF while allowing normal navigation
};

// const getRandomTimeString = () => {
//     const hours = Math.max(Math.floor(Math.random() * 24), 12);
//     const minutes = Math.floor(Math.random() * 60);
//     const seconds = Math.floor(Math.random() * 60);
//     const time = `${hours}:${minutes}:${seconds}`;
//     return time
// }

const getRandomTimeString = () => {
	const hours = Math.max(Math.floor(Math.random() * 24), 12);
	const minutes = Math.floor(Math.random() * 60);
	const seconds = Math.floor(Math.random() * 60);

	const paddedHours = hours.toString().padStart(2, '0');
	const paddedMinutes = minutes.toString().padStart(2, '0');
	const paddedSeconds = seconds.toString().padStart(2, '0');

	// Pacific Time is UTC-07:00 during PDT and UTC-08:00 during PST
	const isPDT = function () {
		// Rough check for PDT (March to November)
		const month = new Date().getMonth();
		return month >= 2 && month <= 10;
	};

	const tzString = isPDT() ? '-07:00' : '-08:00';

	return `${paddedHours}:${paddedMinutes}:${paddedSeconds}${tzString}`;
};

const getTodaysFreebeeId = () => {
	const now = new Date();

	const pacificDateString = now.toLocaleDateString('en-US', {
		timeZone: 'America/Los_Angeles',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

	const [month, day, year] = pacificDateString.split('/');
	const today = `${year}-${month}-${day}`;
	return today;
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, platform }) {
	const token = cookies.get('token');
	let decodedToken = null;
	try {
		const validated = await platform?.env.AUTH_SERVICE.authorizeToken(token);
		decodedToken = validated;
		const winnerSession = cookies.get('winner');
		if (winnerSession && winnerSession === decodedToken.phoneNumber.replace('+', '')) {
			return json({ message: 'You have already won!' });
		}
	} catch (e) {
		// return json({
		// 	success: false,
		// 	message: 'Unauthorized'
		// });
	}
	

	const today = getTodaysFreebeeId();
	let todaysFreebee = await dbFreebees(platform?.env.DB).getFreebee(today);
	if (!todaysFreebee) {
		// create a new freebee when someone visits and there is none existing
		let winner = '';
		let time = getRandomTimeString();
		await dbFreebees(platform?.env.DB).saveFreebee(
			{
				id: today,
				winner: '',
				project_name: freebeeConfig.project_name,
				date: today,
				time: time
			},
			winner
		);
		return json({
			id: today,
			project_name: freebeeConfig.project_name,
			date: today,
			time: time,
			winner: false,
			message: 'there is no freebee today, check back tomorrow!'
		});
	}
	let { id, winner, project_name, date, time, createdAt } = todaysFreebee;
	// if (!time) {
	// 	// generate a random time of day after 12:00:00
	// 	time = getRandomTimeString();
	// 	await dbFreebees(platform?.env.DB).updateFreebee(id, [{ key: 'time', value: time }]);
	// }
	// time = "11:00:00"
	return json({
		id,
		project_name,
		date: date,
		time: time,
		// winner: Boolean(winner),
		winner: false,
		message: `There is a freebee today! ${date} at ${time}`
	});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, platform, request }) {
	const token = cookies.get('token');
	let decodedToken = null;
	try {
		const validated = await platform?.env.AUTH_SERVICE.authorizeToken(token);
		decodedToken = validated;
	} catch (e) {
		return json({
			success: false,
			message: 'Unauthorized'
		});
	}
	const now = new Date();
	const today = getTodaysFreebeeId();
	const freebeeEntry = await dbFreebees(platform?.env.DB).getFreebee(today);

	if (!freebeeEntry) {
		return json({
			success: false,
			message: 'There is no freebee today, check back tomorrow!'
		});
	}
	const diff = concatDateTime(freebeeEntry.date, freebeeEntry.time).getTime() - now.getTime();
	if (diff > 0) {
		console.log(`Freebee is not over yet. ${diff / 1000 / 60} minutes left to go.`);
		return json({
			success: false,
			message: `Freebee is not over yet. ${Math.floor(diff / 1000 / 60)} minutes left to go.`
		});
	}

	console.log(freebeeEntry);
	if (!freebeeEntry.winner) {
		await dbFreebees(platform?.env.DB).updateFreebee(today, [
			{
				key: 'winner',
				value: decodedToken.phoneNumber.replace('+', '')
			}
		]);
		cookies.set('winner', decodedToken.phoneNumber.replace('+', ''), cookieOptions);
		return json({ success: true, message: 'You won the freebee!' });
	} else {
		return json({
			success: false,
			message: 'This Freebee is already claimed, wait for the next one!'
		});
	}
}
