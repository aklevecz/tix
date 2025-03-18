import freebeeApi from '$lib/api/freebee';

/** @type {Freebee} */
const defaultFreebee = {
	id: '',
	project_name: '',
	winner: '',
	date: null,
	time: null
};

const createFreebeeStore = () => {
	let freebee = $state({ ...defaultFreebee });

	return {
		get state() {
			return freebee;
		},
		async init() {
			const config = await freebeeApi.getFreebeeConfig();
			console.log(config.message);
			freebee = config;
			return config;
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
