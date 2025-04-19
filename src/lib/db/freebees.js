/** @param {import('@cloudflare/workers-types').D1Database} db */
const dbFreebees = (db) => {
	const tableName = 'freebees';
	return {
		/** @param {Freebee} freebee @param {string} winner */
		saveFreebee: async (freebee, winner) => {
			const { id, project_name, date, time } = freebee;
			await db
				.prepare(
					`INSERT INTO ${tableName} (id, winner, project_name, date, time) VALUES (?, ?, ?, ?, ?)`
				)
				.bind(id, winner, project_name, date, time)
				.run();
		},
		/**
		 * @param {string} id
		 * @returns {Promise<FreebeeEntry | null>}
		 */
		async getFreebee(id) {
			return db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).bind(id).first();
		},
		/** @param {string} id @param {{key:string, value:string | number}[]} newValues */
		async updateFreebee(id, newValues) {
			const existingFreebee = await this.getFreebee(id);
			if (!existingFreebee) {
				console.error('Freebee does not exist');
				return null;
			}
			try {
				await db
					.prepare(
						`UPDATE ${tableName} SET ${newValues.map((o) => `${o.key} ='${o.value}' WHERE id = ?`)}`
					)
					.bind(id)
					.run();
			} catch (e) {
				console.log(e);
				console.error(`Failed to update ${id} with values ${JSON.stringify(newValues)}`);
			}
		},
		/** @param {string} phoneNumber @param {string} project_name */
		async getFreebeeByPhoneNumberAndProjectName(phoneNumber, project_name) {
			return db
				.prepare(`SELECT * FROM ${tableName} WHERE winner = ? AND project_name = ?`)
				.bind(phoneNumber, project_name)
				.first();
		},
		/**
		 * Atomically update the winner if and only if no winner exists yet
		 * @param {string} id - The freebee ID
		 * @param {string} winner - The winner's phone number UID
		 * @returns {Promise<{success: boolean, message: string}>}
		 */
		async claimFreebeeAtomic(id, winner) {
			// Use UPDATE with a WHERE clause that ensures winner is still empty
			const result = await db
				.prepare(
					`UPDATE ${tableName} SET winner = ? WHERE id = ? AND (winner IS NULL OR winner = '')`
				)
				.bind(winner, id)
				.run();

			// Check if any rows were affected
			if (result.meta.changes === 0) {
				// No rows were updated, which means there's already a winner
				return {
					success: false,
					message: 'This Freebee is already claimed, wait for the next one!'
				};
			}

			return {
				success: true,
				message: 'You won the freebee!'
			};
		},
		async getAllFreebees() {
			const { results } = await db.prepare(`SELECT * FROM ${tableName} ORDER BY rowid DESC`).all();
			/** @type {FreebeeEntry[]} */
			const freebees = /** @type {FreebeeEntry[]} */ (results || []);
			return freebees
		}
	};
};

export default dbFreebees;
