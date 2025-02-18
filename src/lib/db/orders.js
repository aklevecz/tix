/** @param {import('@cloudflare/workers-types').D1Database} db */
const dbOrders = (db) => {
	const tableName = 'tix_orders';
	return {
		/** @param {TixOrder} order */
		saveOrder: async (order) => {
			const {
				pi_id,
				items,
				name,
				phone,
				email,
				discount,
				subtotal,
				amount,
				status,
				project_name,
				origin
			} = order;
			await db
				.prepare(
					`INSERT INTO ${tableName} (pi_id, items, name, phone, email, discount, subtotal, amount, status, project_name, origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
				)
				.bind(
					pi_id,
					items,
					name,
					phone,
					email,
					discount,
					subtotal,
					amount,
					status,
					project_name,
					origin
				)
				.run();
		},

		/**
		 * @param {string} pi_id
		 * @return {Promise<TixOrder|null>}
		 *  */
		async getOrder (pi_id) {
			return db.prepare(`SELECT * FROM ${tableName} WHERE pi_id = ?`).bind(pi_id).first();
		},
		/**
		 * 
		 * @param {string} phoneNumber 
		 * @returns {Promise<Record<string, unknown>[]>}
		 */
		async getOrdersByPhoneNumber(phoneNumber) {
			const {results} =  await db.prepare(`SELECT * FROM ${tableName} WHERE phone = ? AND status = 'success'`).bind(phoneNumber).all();
			return results
		},
		/** @param {string} pi_id @param {{key:string, value:string | number}[]} newValues */
		async updateOrder (pi_id, newValues) {
			const existingOrder = await this.getOrder(pi_id);
			if (!existingOrder) {
				console.error('Order does not exist');
				return null;
			}
			try {
				await db.prepare(
					`UPDATE ${tableName} SET ${newValues.map((o) => `${o.key} ='${o.value}'`)}`
				).run();
			} catch (e) {
				console.log(e);
				console.error(`Failed to update ${pi_id} with values ${JSON.stringify(newValues)}`);
			}
		}
	};
};

export default dbOrders;
