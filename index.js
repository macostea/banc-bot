const getRandomBanc = require("./banc").getRandomBanc;

addEventListener('fetch', event => {
  try {
    const request = event.request;
    if (request.method.toUpperCase() === "POST") {
      return event.respondWith(handlePostRequest(event));
    }

    return event.respondWith(new Response("Method not available"));
  } catch (e) {
    return event.respondWith(new Response("Error thrown " + e.message));
  }
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handlePostRequest(request) {
  const banc = await getRandomBanc();
  return new Response(
    JSON.stringify({
      response_type: "in_channel",
      text: banc
    }),
    {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  });
}
