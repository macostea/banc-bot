import { getBancTTS } from "./banc";
import { getRandomBanc, getCategories, getBancFromCategory } from "./persistence";

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
  const banc = await getRandomBanc(env.DB);
  
  const formRequest = await request.formData();
  let requestText = formRequest.get('text');
  let channelId = formRequest.get('channel_id');

  if (requestText.toUpperCase() === "HELP") {
    return new Response(JSON.stringify({
      response_type: "in_channel",
      text: getHelp(),
    }),
    {
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    });
  }

  if (requestText.toUpperCase() === "CATEGORII") {
    const categories = await getCategories(env.DB);
    return new Response(categories.map(c => c.name).join("\n"));
  }

  if (requestText === "") {
    let res = await getBancTTS(fetch, banc.text, channelId, env.TTS_API_KEY, env.SLACK_BOT_TOKEN);
  
    return new Response(JSON.stringify({
      response_type: "in_channel",
    }),
    {
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    });
  }

  let bancFromCategory = await getBancFromCategory(env.DB, requestText);
  if (!bancFromCategory) {
    return new Response(JSON.stringify({
      response_type: "in_channel",
      text: "Nu există categoria " + requestText,
    }),
    {
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    });
  }

  let res = await getBancTTS(fetch, bancFromCategory.text, channelId, env.TTS_API_KEY, env.SLACK_BOT_TOKEN);
  return new Response(JSON.stringify({
    response_type: "in_channel",
  }),
  {
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

function getHelp() {
  return `Comenzi:
  - help: afișează acest mesaj
  - categorii: afișează categoriile de bancuri
  - <categorie>: redă un banc din categoria specificată
  `;
}