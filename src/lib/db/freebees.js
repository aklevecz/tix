/** @param {import('@cloudflare/workers-types').D1Database} db */
const dbFreebees = (db) => {
	const tableName = 'freebees';
	return {
		/** @param {Freebee} freebee @param {string} winner */
		saveFreebee: async (freebee, winner) => {
			const { id, project_name, date, time } = freebee;
			await db
				.prepare(`INSERT INTO ${tableName} (id, winner, project_name, date, time) VALUES (?, ?, ?, ?, ?)`)
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
					.prepare(`UPDATE ${tableName} SET ${newValues.map((o) => `${o.key} ='${o.value}'`)}`)
					.run();
			} catch (e) {
				console.log(e);
				console.error(`Failed to update ${id} with values ${JSON.stringify(newValues)}`);
			}
		}
	};
};

export default dbFreebees;
