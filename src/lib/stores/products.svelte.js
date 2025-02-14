import productApi from "$lib/api/product";

/** @type {Product[]} */
const defaultState = []

// RIGHT NOW I AM SETTING THE PRODUCTS FROM LAYOUT.SERVER 
// ORIGINALLY I HAD THE PRODUTS CONTAINER FETCH FROM THE SERVER USING INIT
// NOT SURE WHAT I WANT TO USE. MAYBE A COMBO FOR RENDERING AND THEN FETCHING COMPREHENSIVE DATA
const createProducts = () => {
    let products = $state(defaultState);

    const init = async () => {
        products = await productApi.getProducts();
    }

    return {
        get state() {
            return products;
        },
        init,
        /** @param {Product[]} newState */
        set(newState) {
            products = newState;
        }
    };
};

const products = createProducts();
export default products;