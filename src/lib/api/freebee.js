const endpoints = {
	freebee: 'api/freebee'
};

const freebeeApi = () => {
	return {
		getFreebeeConfig: async () => {
			try {
				const response = await fetch(`/${endpoints.freebee}`);
				return await response.json();
			} catch (e) {
				console.error(`api/freebee.js: ERROR WHILE FETCHING ${endpoints.freebee} FROM getFreebee`);
				console.error(e);
			}
		},
		/** @param {{qrBlob:Blob}} data */
		win: async ({ qrBlob }) => {
			try {
				const formData = new FormData();
				formData.append('qr', qrBlob);
				const response = await fetch(`/${endpoints.freebee}`, { method: 'POST', body: formData });
				if (!response.ok) {
					throw new Error("Failed to claim freebee");
				}
				return await response.json();
			} catch (e) {
				console.error(`api/freebee.js: ERROR WHILE FETCHING ${endpoints.freebee}/win`);
				console.error(e);
				alert("Failed to claim freebee :( trying refreshing the page or bugging ari");
				throw new Error("Failed to claim freebee :(");
			}
		}
	};
};

export default freebeeApi();
