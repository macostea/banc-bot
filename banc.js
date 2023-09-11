const cheerio = require("cheerio");
const fetch = require("node-fetch");
const Base64 = require('js-base64');

exports.getRandomBanc = async function getRandomBanc(fetcher) {
  fetchFunction = fetcher;
  if (!fetchFunction) {
    fetchFunction = fetch;
  }

  const categories = JSON.parse('');
  const categoryNumber = Math.floor(Math.random() * categories.length);

  const totalBancNumber = parseInt(categories[categoryNumber][1])
  const bancNumber = Math.floor(Math.random() * totalBancNumber)
  const pageNumber = Math.trunc((bancNumber - 1) / 20) + 1;

  const pageUrl = categories[categoryNumber][0].replace(".htm", "") + "/pagina-" + pageNumber + ".htm";

  const page = await fetchFunction(pageUrl);
  const pageText = await page.text();

  let $ = cheerio.load(pageText);

  const banc = $('.S').eq((bancNumber % 20) - 1).text().trim();

  return banc;
};

exports.getTTS = async function getBancTTS(fetcher, text, channelId) {
  fetchFunction = fetcher;
  if (!fetchFunction) {
    fetchFunction = fetch;
  }

  const url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=" + TTS_API_KEY;
  const body = {
    "audioConfig": {
        "audioEncoding": "MP3"
    },
    "input": {
        "text": text
    },
    "voice": {
        "name": "ro-RO-Standard-A",
        "languageCode": "ro-RO"
    }
  };

  const request = new Request(url, {
    body: JSON.stringify(body),
    method: 'POST'
  });

  const res = await fetchFunction(request);
  const responseBody = await res.json();

  const audio = Base64.toUint8Array(responseBody.audioContent);

  var formData = new FormData();
  formData.append("channels", channelId);
  formData.append("file", new Blob([audio], { type: "audio/mp3" }));
  formData.append("filetype", "mp3");

  const uploadRequest = new Request("https://slack.com/api/files.upload", {
    headers: {
      "Authorization": "Bearer " + SLACK_BOT_TOKEN
    },
    body: formData,
    method: "POST",
  });
  
  let uploadRes = await fetchFunction(uploadRequest);

  return "";
}
