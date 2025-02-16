/** @param {number} price */
export function formatPrice(price) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price / 100);
}

/** @param {string} date */
export function formatDate(date) {
	let timeDate = date
	if (!timeDate.includes('T')) {
		timeDate = `${date}T12:00:00`;
	}
	return new Date(timeDate).toLocaleDateString('en-US', {
		timeZone: 'America/Los_Angeles',
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

/** @param {string} date @param {string} time */
export const dateAndTimeToDateZ = (date, time) => {
	return new Date(`${date}T${time}Z`);
};

/** @param {string} date @param {string} time */
export const concatDateTime = (date, time) => {
	return new Date(`${date}T${time}`);
};
