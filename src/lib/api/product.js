const endpoints = {
    products: 'api/products'
}

const productApi = () => {
    return {
        getProducts: async () => {
            try {
                const response = await fetch(`/${endpoints.products}`);
                return await response.json();
            } catch(e) {
                console.error(`api/product.js: ERROR WHILE FETCHING ${endpoints.products} FROM getProduct`);
                console.error(e);
            }
        }
    }
}

export default productApi()