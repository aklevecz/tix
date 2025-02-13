/**
 * @typedef Project
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {string} description
 * @property {string} location
 * @property {string} img
 */

/**
 * @typedef {Project & {
 *   date: string
 * }} LiveEvent
 */

/**
 * @typedef Product
 * @property {string} id
 * @property {string} projectId
 * @property {string} name
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string} date
 * @property {string} img
 */

/**
 * @typedef {Object} GroupedItem
 * @property {Product} item
 * @property {number} quantity
 */

/**
 * @typedef {Object.<string, GroupedItem>} GroupedItemsMap
 */

/**
 * @typedef {Object} Cart
 * @property {string} id
 * @property {string} createdAt
 * @property {GroupedItemsMap} items
 * @property {number} subtotal
 * @property {number} total
 * @property {number} discount
 */

/** @typedef {import('@stripe/stripe-js').PaymentIntent} PaymentIntent */

/**
 * @typedef TixOrder
 * @property {string} pi_id
 * @property {string} items
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 * @property {number} discount
 * @property {number} subtotal
 * @property {number} amount
 * @property {string} status
 * @property {string} project_name
 * @property {string} origin
 */