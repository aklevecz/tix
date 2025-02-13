/** @param {import('@cloudflare/workers-types').D1Database} db */
const dbOrders = (db) => {
    const tableName = 'tix_orders';
	return {
		/** @param {TixOrder} order */
		saveOrder: async (order) => {
			const { pi_id, items, name, phone, email, discount, subtotal, amount, status, project_name, origin } = order;
			await db
				.prepare(
					`INSERT INTO ${tableName} (pi_id, items, name, phone, email, discount, subtotal, amount, status, project_name, origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
				)
				.bind(pi_id, items, name, phone, email, discount, subtotal, amount, status, project_name, origin)
				.run();
		},

		/**
		 * @param {string} pi_id
		 * @return {Promise<TixOrder|null>}
		 *  */
		getOrder: async (pi_id) => {
			return db.prepare(`SELECT * FROM ${tableName} WHERE pi_id = ?`).bind(pi_id).first();
		}
	};
};

export default dbOrders;
