// SCHEMA
// id TEXT PRIMARY KEY,
// winner TEXT,
// project_name TEXT,
// created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
// claimed_at DATETIME

/** @param {import('@cloudflare/workers-types').D1Database} db */
const dbSharebees = (db) => {
	const tableName = 'sharebees';
	return {
		/** @param {string} id @param {string} project_name */
		saveSharebee: async (id, project_name) => {
			await db
				.prepare(`INSERT INTO ${tableName} (id, project_name) VALUES (?, ?)`)
				.bind(id, project_name)
				.run();
		},

		/**
		 * @param {string} id
		 * @returns {Promise<SharebeeEntry | null>}
		 */
		async getSharebee(id) {
			return db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).bind(id).first();
		},

		/** @param {string} id @param {string} winner*/
		async claimSharebee(id, winner) {
			try {
				await db
					.prepare(
						`UPDATE ${tableName} SET claimed_at = CURRENT_TIMESTAMP, winner = ? WHERE id = ?`
					)
					.bind(winner, id)
					.run();
			} catch (e) {
				console.error(`Failed to claim sharebee ${id}:`, e);
				return false;
			}
			return true;
		},
		/**
		 * Get all sharebees for a specific winner
		 * @param {string} winner
		 * @returns {Promise<SharebeeEntry[] | Record<string, unknown>[]>}
		 */
		async getSharebeesByWinner(winner) {
			return db
				.prepare(`SELECT * FROM ${tableName} WHERE winner = ? ORDER BY created_at DESC`)
				.bind(winner)
				.all()
				.then((result) => result.results);
		},

		/**
		 * Retrieves a sharebee entry based on the winner's phone number and project name.
		 * @param {string} phoneNumber - The phone number of the winner.
		 * @param {string} projectName - The name of the project.
		 * @returns {Promise<SharebeeEntry | null>} A promise that resolves to the sharebee entry if found, otherwise null.
		 */

		async getSharebeeByPhoneNumberAndProjectName(phoneNumber, projectName) {
			return db
				.prepare(`SELECT * FROM ${tableName} WHERE winner = ? AND project_name = ?`)
				.bind(phoneNumber, projectName)
				.first();
		},
		/**
		 * Get all unclaimed sharebees
		 * @returns {Promise<SharebeeEntry[] | Record<string, unknown>[]>}
		 */
		async getUnclaimedSharebees() {
			return db
				.prepare(`SELECT * FROM ${tableName} WHERE claimed_at IS NULL ORDER BY created_at DESC`)
				.all()
				.then((result) => result.results);
		},

		/**
		 * Reset all sharebees
		 */

		async resetSharebees() {
			try {
				await db.prepare(`DELETE FROM ${tableName}`).run();
				await db
					.prepare(`INSERT INTO sharebees (id, project_name) VALUES ('TEST', 'raptor-faight-2');`)
					.run();
			} catch (e) {
				console.error(`Failed to reset sharebees:`, e);
				return false;
			}
			return true;
		}
	};
};

/**
 * @typedef {Object} SharebeeEntry
 * @property {string} id
 * @property {string} winner
 * @property {string} project_name
 * @property {string} created_at
 * @property {string | null} claimed_at
 */

export default dbSharebees;
