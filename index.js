const getRandomBanc = require("./banc").getRandomBanc;
const getTTS = require("./banc").getTTS;

addEventListener('fetch', event => {
  try {
    const request = event.request;
    if (request.method.toUpperCase() === "POST") {
      return event.respondWith(handlePostRequest(request));
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
  
  const formRequest = await request.formData();
  let requestText = formRequest.get('text');
  let channelId = formRequest.get('channel_id');

  if (requestText && requestText.trim().toUpperCase() === "TTS") {
    let res = await getTTS(fetch, banc, channelId);
  }

  return new Response(
    JSON.stringify({
      response_type: "in_channel",
      text: banc
    }),
    {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  });
}
