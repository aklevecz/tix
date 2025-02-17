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
 * @typedef PriceConfig
 * @property {number} base
 * @property {boolean} slidingScale
 * @property {number} min
 * @property {number} max
 * @property {number} step
 */

/**
 * @typedef Product
 * @property {string} id
 * @property {string} projectId
 * @property {'ticket'} productType
 * @property {string} name
 * @property {string} title
 * @property {string} description
 * @property {Locale | null} place
 * @property {number} price
 * @property {PriceConfig} priceConfig
 * @property {string} date
 * @property {string[]} dates
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

/** 
 * @typedef PhoneNumber
 * @property {string} countryCode
 * @property {string} number
 */

/**
 * @typedef {Object} User
 * @property {string} fullName
 * @property {PhoneNumber} phoneNumber
 * @property {string} email
 */

/** 
 * @typedef Freebee
 * @property {string} id
 * @property {string} project_name
 * @property {string | null} winner
 * @property {string | null} date
 * @property {string | null} time
 */

/** 
 * @typedef FreebeeEntry
 * @property {string} id
 * @property {string} project_name
 * @property {string} winner
 * @property {string} date
 * @property {string} time
 * @property {string} createdAt
 */

/** 
 * @typedef {Object} Locale
 * @property {string} name
 * @property {string} address
 * @property {number} lat
 * @property {number} lng
 */