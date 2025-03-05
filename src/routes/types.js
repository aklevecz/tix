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
 * @property {string} primaryColor
 * @property {string} secondaryColor
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

/** @typedef {('idle'|'starting'|'processing'|'succeeded'|'failed'|'canceled'|'regenerate')} Status */

/**
 * @typedef {Object} ReplicateResponse
 * @property {string} id - Unique identifier for the prediction
 * @property {string} model - Name of the model used for the prediction
 * @property {string} version - Version of the model used
 * @property {Object} input - Input parameters for the prediction
 * @property {string} input.hf_lora - HuggingFace LoRA identifier
 * @property {string} input.prompt - Text prompt used for the prediction
 * @property {string} logs - Any logs generated during the prediction process
 * @property {string[]} output - Array of URLs to the generated output(s)
 * @property {boolean} data_removed - Indicates whether the data has been removed
 * @property {null|string} error - Error message if an error occurred, null otherwise
 * @property {Status} status - Current status of the prediction
 * @property {string} created_at - ISO 8601 timestamp of when the prediction was created
 * @property {Object} urls - URLs for additional actions
 * @property {string} urls.cancel - URL to cancel the prediction
 * @property {string} urls.get - URL to get the prediction details
 */

/**
 * @typedef {Object} GeneratedImgEntry
 * @property {string} id
 * @property {string} imgUrl
 * @property {string} base64Url
 * @property {string} seed
 * @property {string} prompt
 */

/**
 * @typedef {Object} TokenResult
 * @property {'OK'|'ERROR'} status - Status of the tokenization operation
 * @property {string} [token] - Payment token when status is 'OK'
 * @property {Array<{code: string, detail: string, field: string}>} [errors] - Errors when status is 'ERROR'
 */

/**
 * @typedef {Object} PaymentMethod
 * @property {function(): Promise<TokenResult>} tokenize - Tokenize the payment method
 * @property {function(string): Promise<void>} attach - Attach to a DOM element
 * @property {function(): void} destroy - Clean up the payment method
 */

/**
 * @typedef {PaymentMethod} CardPaymentMethod
 */

/**
 * @typedef {PaymentMethod} ApplePayMethod
 */

/** 
 * @typedef {PaymentMethod} GooglePayMethod
 */

/**
 * @typedef {Object} Payments
 * @property {function(Object=): Promise<CardPaymentMethod>} card - Create a card payment method
 * @property {function(PaymentRequest): Promise<ApplePayMethod>} applePay - Create an Apple Pay payment method
 * @property {function(PaymentRequest): Promise<GooglePayMethod>} googlePay - Create a Google Pay payment method
 * @property {function(Object): PaymentRequest} paymentRequest - Create a payment request
 */

/**
 * @typedef {Object} Square
 * @property {function(string, string): Payments} payments - Create a payments object
 */