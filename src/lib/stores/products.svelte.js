import productApi from "$lib/api/product";

/** @type {Product[]} */
const defaultState = []

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