import backgrounds from '$lib/backgrounds';
import configurations from '$lib/configurations';
import storage from '$lib/storage';
import { fetchImageAsBase64 } from '$lib/utils';

export const GenerationErrors = {
	NETWORK: 'Check your internet connection and try again',
	NO_RESPONSE: 'No response from server',
	TIMEOUT: 'Generation took too long',
	CANCELED: 'Generation was canceled',
	FAILED: 'Generation failed - please try again',
	INVALID_ID: 'Invalid generation ID received'
};

const endpoints = {
	generate: '/api/generate'
};

const api = (function () {
	return {
		/**
		 *
		 * @param {*} prompt
		 * @param {*} model
		 * @returns
		 */
		generate: async (prompt, model) => {
			let configuration = configurations[model];
			try {
				let res = await fetch(endpoints.generate, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						model: model,
						// could also do this server side
						prompt: prompt
							.toLocaleLowerCase()
							.replaceAll(configuration.promptWord, configuration.triggerWord)
					})
				});
				let data = await res.json();
				return data;
			} catch (error) {
				console.error(error);
				throw new Error(GenerationErrors.NETWORK);
			}
		},
		/**
		 * Makes a GET request to the /generate endpoint with a generation ID
		 * as a query string parameter. Returns the response as a Promise.
		 *
		 * @param {string} id The ID of the generation to check.
		 * @return {Promise<ReplicateResponse>} The response from the server.
		 */
		checkGeneration: async (id) => {
			let res = await fetch(`${endpoints.generate}?id=${id}`);
			let data = await res.json();
			return data;
		}
	};
})();

/** @type {{generating: boolean, status: Status, outputs: any[], percentage: number, cachedImgs: GeneratedImgEntry[], cachedImg:string; lastImgUrl: string}} */
const defaultState = {
	generating: false,
	status: 'idle',
	outputs: [],
	percentage: 0,
	cachedImgs: [],
	cachedImg: '',
	lastImgUrl: ''
};
const createGenerateStore = () => {
	let generate = $state({ ...defaultState });

	async function fetchUploadedGeneration() {
		const res = await fetch('api/upload');
		if (res.ok) {
			const imgBuffer = await res.arrayBuffer();
			const blob = new Blob([imgBuffer], { type: 'image/jpeg' }); // adjust mime type as needed
			const imageUrl = URL.createObjectURL(blob);
			// generate.setImg(imageUrl);
			generate.lastImgUrl = imageUrl;

			const base64 = await fetchImageAsBase64(imageUrl);
			storage.saveLastGenerated(base64);

			return true;
		}
		return false;
	}

	async function refreshAllGeneratedImgs() {
		// const generatedImgs = await modelStorage.getAllGeneratedImgs();
		// generate.cachedImgs = generatedImgs;
		// if there is a cached generation
		let lastGenerated = storage.getLastGenerated();
		if (lastGenerated) {
			generate.cachedImgs = [lastGenerated];
			generate.cachedImg = lastGenerated;
		}

		// if there is no cached generation then try to fetch one
		let fetchSuccess = false;
		if (!lastGenerated) {
			fetchSuccess = await fetchUploadedGeneration();
			if (fetchSuccess) {
				let lastGenerated = storage.getLastGenerated();
				generate.cachedImgs = [lastGenerated];
				generate.cachedImg = lastGenerated;
			}
		}
	}

	return {
		get state() {
			return generate;
		},
		init: async () => {
			// refreshAllGeneratedImgs();
			await refreshAllGeneratedImgs();
			// 	modelStorage.getAllGeneratedImgs().then(async (imgs) => {
			// 		for (let fav of raptorSvelte.state.favoriteBaos) {
			// 			if (!imgs.find((/** @type {*} */ i) => i.id === fav)) {
			// 				try {
			// 					const base64 = await fetchImageAsBase64(
			// 						`/img?id=${authSvelte.state.user.phoneNumber}/${fav}`
			// 					);
			// 					// storage.saveLastGenerated(base64);
			// 					await modelStorage.addGeneratedImg(
			// 						{
			// 							imgUrl: 'imgurl',
			// 							base64Url: base64,
			// 							seed: 'seed',
			// 							prompt: 'prompt'
			// 						},
			// 						fav
			// 					);
			// 				} catch (error) {
			// 					console.error(error);
			// 				}
			// 			} else {
			// 			}
			// 		}
			// await refreshAllGeneratedImgs();
			// 	});
		},
		/**
		 * Asynchronously generates data based on the provided prompt by making
		 * a request to the API.
		 *
		 * @param {string} prompt - The text prompt used for generating data.
		 * @param {string} model - The model used for generating data.
		 * @returns {Promise<ReplicateResponse | undefined>} - A promise that resolves with the generated data.
		 * @throws Will log an error if the request fails.
		 */
		async createGeneration(prompt, model) {
			generate.generating = true;
			try {
				let data = await api.generate(prompt, model);
				return data;
			} catch (error) {
				console.error(error);
			}
		},

		/**
		 * Periodically polls the API to check on the status of a generation.
		 * If the generation has finished, updates the state and clears the interval.
		 * If the generation times out (defined by `maxTimeout`), clears the interval and
		 * sets the state to "canceled".
		 *
		 * @param {string} id - The generation ID to poll.
		 * @returns {Promise<number>} The ID of the interval that was set.
		 */
		async pollGeneration(id) {
			console.log(`Polling generation ${id}`);
			/** @type {*} */
			let interval = null;
			let intervalMs = 1000;
			let maxTimeout = 60 * 1000 * 6;
			let intervalStart = Date.now();
			generate.generating = true;
			interval = setInterval(async () => {
				const data = await api.checkGeneration(id);
				const str = data.logs;
				const seed = str.match(/Using seed: (\d+)/)?.[1];
				const prompt = str.match(/Prompt: (.*?)(?=txt2img)/s)?.[1];
				const loadTime = str.match(/Loading LoRA took: ([\d.]+)/)?.[1];

				// Updated regex for progress updates
				const progressUpdates = [
					...str.matchAll(/(\d+)%\|[█▌▎▍▋▊▉ ]+\| (\d+)\/(\d+) \[([^\]]+)\](?:, ([\d.]+)it\/s)?/g)
				].map((match) => ({
					percentage: parseInt(match[1]),
					step: parseInt(match[2]),
					totalSteps: parseInt(match[3]),
					time: match[4],
					iterationsPerSecond: match[5] ? parseFloat(match[5]) : null
				}));

				try {
					generate.percentage = progressUpdates[progressUpdates.length - 1].percentage;
				} catch (e) {}

				console.log({
					seed,
					prompt,
					loadTime,
					progressUpdates
				});
				console.log(data.status);

				generate.status = data.status;
				if (data.status === 'succeeded') {
					generate.generating = false;
					generate.outputs = data.output;
					// history.add(data.output[0]);
					const imgUrl = data.output[0];
					generate.lastImgUrl = imgUrl;
					console.log(`generated img url: ${imgUrl}`);
					try {
						// Fetch the image
						const response = await fetch(imgUrl);
						const blob = await response.blob();
						const formData = new FormData();

						// Create a new blob with explicit content type
						// const imageBlob = new Blob([blob], { type: 'image/png' });
						// formData.append('image', imageBlob, `${imgObject.id}.png`);

						const imageBlob = new Blob([blob], { type: 'image/jpeg' });
						formData.append('image', imageBlob, `raptor.jpg`);
						// formData.append('id', "cd-" + Math.round(Date.now() /1000));
						formData.append('id', 'raptor');
						formData.append('prompt', prompt || 'missing prompt');

						console.log('Upload sizes:', {
							original: imageBlob.size
							// thumbnail: thumbnailBlob.size
						});

						// Debug log
						console.log('Upload content type:', imageBlob.type);

						const uploadResponse = await fetch('/api/upload', {
							method: 'POST',
							body: formData
						});

						if (!uploadResponse.ok) {
							const errorData = await uploadResponse.json();
							throw new Error(errorData.error || 'Upload failed');
						}

						const result = await uploadResponse.json();
						console.log('Upload successful:', result);
					} catch (error) {
						console.error('Upload error:', error);
						throw error; // Re-throw to handle in calling function
					}
					// fetch image data and then store it in base64 string to be stored in browser storage
					// CODE HERE
					fetchImageAsBase64(imgUrl, { maxWidth: 512, quality: 0.5 }).then(async (base64) => {
						console.log(`image saved to storage`);
						storage.saveLastGenerated(base64);
					});
					clearInterval(interval);
				} else if (data.status === 'failed') {
					generate.generating = false;
					clearInterval(interval);
				} else if (data.status === 'canceled') {
					generate.generating = false;
					clearInterval(interval);
				}
				let timeElapsed = Date.now() - intervalStart;
				if (timeElapsed > maxTimeout) {
					generate.generating = false;
					clearInterval(interval);
				}
			}, intervalMs);
			return interval;
		},
		/** @param {string} imgUrl */
		setImg: (imgUrl) => {
			generate.lastImgUrl = imgUrl;
		},
		/** @param {Status} status */
		updateStatus: (status) => {
			generate.status = status;
		},
		fetchUploadedGeneration,
		refreshAllGeneratedImgs,
		async generateRaptor() {
			// const text = `A compact disc (CD) with the word '${auth.state.user.name.split(" ")[0]}' handwritten in black marker on the silver surface. Abstract pastel colored smoke or mist effects swirl in the background. cute retro style. photo realistic.`
			const randomBetween0and100 = Math.floor(Math.random() * 100);
			const randomBackground = backgrounds[randomBetween0and100];
			const text = `a baby raptor hatching from an egg ${randomBackground}`;
			const model = 'aklevecz/flux-raptor-lora';
			try {
				let data = await this.createGeneration(text, model);
				if (!data?.id) {
					throw new Error('id is missing');
				}
        console.log(`Polling generation: ${data.id}`);
				this.pollGeneration(data.id);
			} catch (/** @type {*} */ e) {
				alert(e.message);
			}
		},
		reset: () => {
			generate = { ...defaultState, cachedImgs: generate.cachedImgs };
			storage.deleteLastGenerated();
		}
	};
};

export default createGenerateStore();
