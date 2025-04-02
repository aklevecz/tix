import { Byte, Encoder } from '@nuintun/qrcode';

/** @param {string} data */
export async function generateQR(data) {
	const encoder = new Encoder({
		level: 'H'
	});

	const qrcode = encoder.encode(new Byte(data));

	const qrCodeUrl = qrcode.toDataURL(5, {
		// First arg: moduleSize is now 20
		margin: 4 // Optional margin
	});
	const qrBlob = await fetch(qrCodeUrl).then((res) => res.blob());

	return { dataUrl: qrCodeUrl, blob: qrBlob };
}
