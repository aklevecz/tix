/** @type {Product} */
const defaultState = {
	id: '',
	projectId: '',
    productType: 'ticket',
	name: '',
	title: '',
	description: '',
    price: 0,
	priceConfig: {
		base: 0,
		slidingScale: false,
		min: 0,
		max: 0,
		step: 0
	},
    date: '',
	dates: [''],
	img: ''
};

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
