import { EVENT_ID } from '$lib';

// SHOULD JUST PROXY IMAGES FROM R2 OR SOMETHING
/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, platform, url }) {
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(null, { status: 404 });
  }
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

    const key = `${EVENT_ID}/${phoneNumber}/raptor.jpeg`;
    const object = await platform.env.R2.get(key);
    if (!object) {
      return new Response("Image not found", { status: 404 });
    }

    // Return R2 object with its headers
    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata.contentType || "image/jpeg",
        "cache-control": "public, max-age=31536000",
        etag: object.httpEtag,
      },
    });
  } catch (e) {
    console.error(e);
  }
  return new Response(null, { status: 404 });
}
