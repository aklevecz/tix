const endpoints = {
    freebee: 'api/freebee'
}

const freebeeApi = () => {
    return {
        getFreebeeConfig: async () => {
            try {
                const response = await fetch(`/${endpoints.freebee}`);
                return await response.json();
            } catch(e) {
                console.error(`api/freebee.js: ERROR WHILE FETCHING ${endpoints.freebee} FROM getFreebee`);
                console.error(e);
            }
        },
        win: async () => {
            try {
                const response = await fetch(`/${endpoints.freebee}`, {method: "POST"});
                return await response.json();
            } catch(e) {
                console.error(`api/freebee.js: ERROR WHILE FETCHING ${endpoints.freebee}/win`);
                console.error(e);
            }
        }
    }
}

export default freebeeApi()