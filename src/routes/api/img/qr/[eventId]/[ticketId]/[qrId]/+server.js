import { EVENT_ID } from '$lib';

// SHOULD JUST PROXY IMAGES FROM R2 OR SOMETHING
/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, platform, params}) {
  // eventId is the event id, ticket id is either paymentintent, shareeeId, or freebeeId, and qrId is either the intent index or sharebee or freebee
  const {eventId, ticketId, qrId} = params
  console.log(eventId, ticketId, qrId)
  try {
    // Validate platform and storage
    if (!platform?.env.R2) {
      throw new Error("Storage not configured");
    }

    const token = cookies.get("token");
    if (!token) {
      throw new Error("No authentication token provided");
    }

    const { phoneNumber } = await platform.env.AUTH_SERVICE.authorizeToken(token);
    if (!phoneNumber) {
      throw new Error("Invalid authentication payload");
    }

    const key = `orders-qrs/${eventId}/${ticketId}/${qrId}.png`;
    const object = await platform.env.R2.get(key);
    if (!object) {
      return new Response("Image not found", { status: 404 });
    }

    // Return R2 object with its headers
    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata.contentType || "image/png",
        "cache-control": "public, max-age=31536000",
        etag: object.httpEtag,
      },
    });
  } catch (e) {
    console.error(e);
  }
  return new Response(null, { status: 404 });
}
