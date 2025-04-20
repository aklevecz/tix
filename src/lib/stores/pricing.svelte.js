function createPricingStore() {
	const pricing = $state({ increase: 0 });
	return {
		get state() {
			return pricing;
		},
		/** @param {number} increase */
		setIncrease(increase) {
			pricing.increase = increase;
		}
	};
}

const pricing = createPricingStore();

export default pricing;
