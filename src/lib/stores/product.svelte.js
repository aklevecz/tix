/** @type {Product} */
const defaultState = {
	id: '',
	projectId: '',
    productType: 'ticket',
	name: '',
	title: '',
	description: '',
	place: {
		name: '',
		address: '',
		lat: 0,
		lng: 0
	},
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
