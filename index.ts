import { getRandomBanc, getBancTTS } from "./banc";

export interface Env {
  TTS_API_KEY: string;
  SLACK_BOT_TOKEN: string;
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    try {
      if (request.method.toUpperCase() === "POST") {
        return handlePostRequest(request, env);
      }
  
      return new Response("Method not available");
    } catch (e) {
      return new Response("Error thrown " + e.message);
    }  
  }
}

async function handlePostRequest(request: Request, env: Env) {
  const banc = await getRandomBanc(null);
  
  const formRequest = await request.formData();
  let requestText = formRequest.get('text');
  let channelId = formRequest.get('channel_id');

  if (requestText && requestText.trim().toUpperCase() === "TTS") {
    let res = await getBancTTS(fetch, banc, channelId, env.TTS_API_KEY, env.SLACK_BOT_TOKEN);
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
