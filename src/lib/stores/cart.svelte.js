import cartApi from '$lib/api/cart';

/** @type {Cart} */
export const defaultCart = {
	id: '',
	createdAt: '',
	items: /** @type {GroupedItemsMap} */ ({}),
    discount: 0,
	subtotal: 0,
	total: 0
};

const createCartStore = () => {
	/** @type {Cart} */
	let cart = $state({ ...defaultCart });

	function calculateTotals() {
		cart.subtotal = Object.values(cart.items).reduce((sum, { item, quantity }) => {
			return sum + item.price * quantity;
		}, 0);
        const discountAmount = cart.subtotal * (cart.discount / 100);
		cart.total = cart.subtotal - discountAmount;
        cart.total = Number(cart.total.toFixed(2))
	}

	function saveCartSession() {
		document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; path=/; max-age=${60 * 60 * 24 * 30}`;
		cartApi.updateCart(cart);
	}

	return {
		get state() {
			return cart;
		},

		/**
		 * @param {Cart} newCart
		 */
		set(newCart) {
			cart = newCart;
			calculateTotals();
		},

		/**
		 * @param {Product} item
		 */
		add(item) {
			if (cart.items[item.id]) {
				cart.items[item.id].quantity++;
			} else {
				cart.items[item.id] = { item, quantity: 1 };
			}
			calculateTotals();
			saveCartSession();
		},

		/**
		 * @param {Product} item
		 */
		remove(item) {
			if (cart.items[item.id]) {
				if (cart.items[item.id].quantity > 1) {
					cart.items[item.id].quantity--;
				} else {
					delete cart.items[item.id];
				}
				calculateTotals();
				saveCartSession();
			}
		},

		/**
		 * @param {string} productId
		 * @returns {number}
		 */
		getQuantity(productId) {
			return cart.items[productId]?.quantity || 0;
		},

		/**
		 * @returns {GroupedItem[]}
		 */
		getGroupedItems() {
			return Object.values(cart.items);
		},
        /** @param {number} discount */
        applyDiscount(discount) {
            cart.discount = discount;
            calculateTotals();
            saveCartSession();
        },

		reset() {
			cart = { ...defaultCart };
			saveCartSession();
		}
	};
};

const cart = createCartStore();
export default cart;
