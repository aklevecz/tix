/** @type {Product} */
const defaultState = {
    id: '',
    projectId: '',
    name: '',
    title: '',
    description: '',
    price: 0,
    date: '',
    img: ''
}

const createProduct = () => {
    const product = $state({ ...defaultState });

    return {
        get state() {
            return product;
        }
    };
};

const product = createProduct();
export default product;