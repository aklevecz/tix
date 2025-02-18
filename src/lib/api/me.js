const endpoints = {
    me: 'api/me'
}

const meApi = () => {
    return {
        getMe: async () => {
            try {
                const response = await fetch(`/${endpoints.me}`);
                return await response.json();
            } catch (e) {
                console.error(`api/me.js: ERROR WHILE FETCHING ${endpoints.me} FROM getMe`);
                console.error(e);
            }
        }
    }
}

export default meApi()