import dbFreebees from '$lib/db/freebees';
import { dateAndTimeToDateZ } from '$lib/utils';
import { json } from '@sveltejs/kit';

let freebeeConfig = {
	id: 'freebee-1',
	project_name: 'raptor-faight-2',
	nextFreebeeDate: '2025-02-15',
	nextFreebeeTime: '12:00:00'
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
export async function GET({ platform }) {
	const today = getTodaysFreebeeId();
	const todaysFreebee = await dbFreebees(platform?.env.DB).getFreebee(today);

	if (!todaysFreebee) {
		return json({
			message: 'there is no freebee today, check back tomorrow!'
		});
	}
	console.log(todaysFreebee);
	let { id, winner, project_name, date, time, createdAt } = todaysFreebee;
	console.log(winner);
	if (!time) {
		// generate a random time of day after 12:00:00
		const hours = Math.max(Math.floor(Math.random() * 24), 12);
		const minutes = Math.floor(Math.random() * 60);
		const seconds = Math.floor(Math.random() * 60);
		time = `${hours}:${minutes}:${seconds}`;
		await dbFreebees(platform?.env.DB).updateFreebee(id, [{ key: 'time', value: time }]);
	}
	return json({
		id,
		project_name,
		nextFreebeeDate: date,
		nextFreebeeTime: time,
		winner: Boolean(winner)
	});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ platform, request }) {
	const now = new Date();
    const today = getTodaysFreebeeId();
	const freebeeEntry = await dbFreebees(platform?.env.DB).getFreebee(today);

    if (!freebeeEntry) {
        return json({
            success: false,
            message: 'There is no freebee today, check back tomorrow!'
        });
    }
	const diff =
		dateAndTimeToDateZ(freebeeEntry.date, freebeeEntry.time).getTime() -
		now.getTime();
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
				value: 'WEINER'
			}
		]);
		return json({ success: true, message: 'You won the freebee!' });
	} else {
		return json({
			success: false,
			message: 'This Freebee is already claimed, wait for the next one!'
		});
	}
}
