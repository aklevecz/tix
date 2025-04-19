const endpoints = {
    sharebee: 'api/sharebee',
    reset: 'api/sharebee/reset'
}

const sharebeeApi = () => {
    return {
        getSharebeeConfig: async () => {
            try {
                const response = await fetch(`/${endpoints.sharebee}`);
                return await response.json();
            } catch(e) {
                console.error(`api/sharebee.js: ERROR WHILE FETCHING ${endpoints.sharebee}`);
                console.error(e);
            }
        },
        /** @param {string} id @param {Blob} qrBlob */
        claim: async (id, qrBlob) => {
            try {
                const formData = new FormData();
                formData.append('id', id);
                formData.append('qr', qrBlob);
                const response = await fetch(`/${endpoints.sharebee}`, {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("Failed to claim sharebee");
                }

                return await response.json();
            } catch(e) {
                console.error(`api/sharebee.js: ERROR WHILE FETCHING ${endpoints.sharebee}`);
                alert("Failed to claim sharebee :( - try refreshing the page or bugging ari");
                console.error(e);
                throw new Error(`Failed to claim sharebee :( for sharebee ${id}`);
            }
        },
        reset: async () => {
            try {
                const response = await fetch(`/${endpoints.reset}`, {
                    method: "POST"
                });
                return await response.json();
            } catch(e) {
                console.error(`api/sharebee.js: ERROR WHILE RESETTING SHAREBEES`);
                console.error(e);
            }
        }
    }
}

export default sharebeeApi()
