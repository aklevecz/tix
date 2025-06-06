import { browser } from '$app/environment';

/** @param {number} price */
export function formatPrice(price) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price / 100);
}

/** @param {string} date */
export function formatDate(date) {
	let timeDate = date;
	// if (!timeDate.includes('T')) {
	if (!timeDate.includes(':')) {
		timeDate = `${date}T12:00:00`;
	}
	return new Date(timeDate).toLocaleDateString('en-US', {
		timeZone: 'America/Los_Angeles',
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

/** @param {string} date @param {string} time */
export const dateAndTimeToDateZ = (date, time) => {
	return new Date(`${date}T${time}Z`);
};

/** @param {string} date @param {string} time */
export const concatDateTime = (date, time) => {
	return new Date(`${date}T${time}`);
};

/**
 * Compresses an image blob using the WebP format and a given quality setting.
 * @param {Blob} blob - The image blob to compress.
 * @param {number} maxWidth - The maximum width of the compressed image.
 * @param {number} quality - The quality setting for the WebP compression.
 * @returns {Promise<Blob>} A promise that resolves with the compressed image blob.
 */
async function compressImage(blob, maxWidth, quality) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = URL.createObjectURL(blob);

		img.onload = () => {
			URL.revokeObjectURL(img.src);
			const canvas = document.createElement('canvas');

			// Calculate new dimensions
			let width = img.width;
			let height = img.height;

			if (width > maxWidth) {
				height = Math.round((height * maxWidth) / width);
				width = maxWidth;
			}

			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Failed to get canvas context'));
				return;
			}

			// Draw the image
			ctx.drawImage(img, 0, 0, width, height);

			// Convert to WebP with compression
			canvas.toBlob(
				/* @ts-ignore */
				(blob) => resolve(blob),
				'image/webp',
				quality
			);
		};

		img.onerror = () => reject(new Error('Failed to load image'));
	});
}

/**
 * Fetches an image from the provided URL, compresses it, and returns a base64 encoded string.
 *
 * @param {string} imageUrl - The URL of the image to fetch.
 * @param {Object} [options] - Optional settings.
 * @param {number} [options.maxWidth=800] - The maximum width of the compressed image.
 * @param {number} [options.quality=0.8] - The quality setting for image compression (0 to 1).
 * @returns {Promise<string>} A promise that resolves with the base64 encoded image string.
 * @throws Will throw an error if the fetch operation fails or if the image cannot be compressed.
 */

export async function fetchImageAsBase64(imageUrl, { maxWidth = 800, quality = 0.8 } = {}) {
	try {
		const response = await fetch(imageUrl);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const blob = await response.blob();

		// Create compressed blob first
		const compressedBlob = await compressImage(blob, maxWidth, quality);

		// Convert to base64
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			// @ts-ignore
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(compressedBlob);
		});
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

/** @param {string} phoneNumber */
export function phoneNumberToUid(phoneNumber) {
	return phoneNumber.replace('+', '');
}

export const delay = (t = 500) => new Promise((r) => setTimeout(r, t));

/**
 * Simple hash function to detect changes in an object
 * @param {Object} obj - The object to hash
 * @return {string} A hash string representing the content
 */
export function hashFunction(obj) {
	// Convert the object to a stable JSON string
	// (ensures consistent property ordering)
	const str = JSON.stringify(obj, Object.keys(obj).sort());

	// Simple string hash function
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	// Convert to hex string to make it more readable
	return Math.abs(hash).toString(16);
}

// this could be only serverside
/** @param {string} id @param {string} phoneNumber */
export function createSharebeeHash(id, phoneNumber) {
	const hashedPhoneNumber = hashFunction(phoneNumber);
	const hashedId = hashFunction(id);
	const determinedSharebeeId = `${hashedPhoneNumber}-${hashedId}`;
	return determinedSharebeeId;
}

/** @param {string} id */
export function createSharebeeUrlBrowser(id) {
	if (browser) {
		// const baseUrl = window.location.href.split('/sharebee')[0];
		const baseUrl = `${window.location.protocol}//${window.location.host}`;
		return `${baseUrl}/sharebee/${encodeURIComponent(id)}`;
	}
	return '';
}


/**
 * Calculates the increment based on current date relative to April 20, 2025
 * @param {number} startValue - The initial value before any increments
 * @returns {number|string} - The value after all increments or a message if outside date range
 */
export function calculateIncrementByCurrentDate(startValue = 0) {
	// Define start and end dates
	const startDate = new Date(2025, 3, 20); // April 20, 2025
	const endDate = new Date(2025, 4, 2);    // May 2, 2025
	
	// Get current date and normalize times for comparison
	const currentDate = new Date();
	
	startDate.setHours(0, 0, 0, 0);
	endDate.setHours(23, 59, 59, 999);
	currentDate.setHours(0, 0, 0, 0);
	
	// Check if current date is within range
	if (currentDate < startDate || currentDate > endDate) {
	  return "Current date is outside the specified range (April 20 - May 2, 2025)";
	}
	
	// Calculate days elapsed since start date
	const daysElapsed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
	
	// Calculate increments (integer division by 4)
	const increments = Math.floor(daysElapsed / 4);
	
	// Return the final value
	return startValue + increments;
  }