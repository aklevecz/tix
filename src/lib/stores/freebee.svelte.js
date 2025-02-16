import freebeeApi from '$lib/api/freebee';

/** @type {Freebee} */
const defaultFreebee = {
	id: '',
	project_name: '',
	nextFreebeeDate: null,
	nextFreebeeTime: null
};

const createFreebeeStore = () => {
	let freebee = $state(defaultFreebee);

	return {
		get state() {
			return freebee;
		},
		async init() {
			const config = await freebeeApi.getFreebeeConfig();
			freebee = config;
            return config
		},
		/** @param {Freebee} newState */
		set(newState) {
			freebee = { ...freebee, ...newState };
		},
		win() {
			return freebeeApi.win();
		}
	};
};

const freebee = createFreebeeStore();
export default freebee;
