import { Base64 } from "js-base64";

export async function getBancTTS(fetcher: any, text: string, channelId: string, ttsApiKey: string, slackBotToken: string) {
  var fetchFunction = fetcher;
  if (!fetchFunction) {
    fetchFunction = fetch;
  }

  const url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=" + ttsApiKey;
  const body = {
    "audioConfig": {
        "audioEncoding": "MP3"
    },
    "input": {
        "text": text
    },
    "voice": {
        "name": "ro-RO-Wavenet-A",
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
  formData.append("initial_comment", text);

  const uploadRequest = new Request("https://slack.com/api/files.upload", {
    headers: {
      "Authorization": "Bearer " + slackBotToken
    },
    body: formData,
    method: "POST",
  });

  let uploadRes = await fetchFunction(uploadRequest);

  return uploadRes;
}
