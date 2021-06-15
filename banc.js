const cheerio = require("cheerio");
const fetch = require("node-fetch");
const Base64 = require('js-base64');

exports.getRandomBanc = async function getRandomBanc(fetcher) {
  fetchFunction = fetcher;
  if (!fetchFunction) {
    fetchFunction = fetch;
  }

  const categories = JSON.parse('[["http://www.bancuri.net/Categoria_Albanezi-39.htm","10"],["http://www.bancuri.net/Categoria_Alinuta-4.htm","96"],["http://www.bancuri.net/Categoria_Animale-8.htm","173"],["http://www.bancuri.net/Categoria_Anunturi-54.htm","33"],["http://www.bancuri.net/Categoria_Arabi-53.htm","4"],["http://www.bancuri.net/Categoria_Ardeleni-33.htm","51"],["http://www.bancuri.net/Categoria_Avioane-51.htm","12"],["http://www.bancuri.net/Categoria_Bancuri_noi-35.htm","1403"],["http://www.bancuri.net/Categoria_Barbati_si_femei-42.htm","732"],["http://www.bancuri.net/Categoria_Betivi-24.htm","95"],["http://www.bancuri.net/Categoria_Blonde-2.htm","156"],["http://www.bancuri.net/Categoria_Bula-3.htm","159"],["http://www.bancuri.net/Categoria_Canibali-41.htm","21"],["http://www.bancuri.net/Categoria_Computere-26.htm","69"],["http://www.bancuri.net/Categoria_Corporatiste-52.htm","25"],["http://www.bancuri.net/Categoria_Cugetari-16.htm","119"],["http://www.bancuri.net/Categoria_Culmi-20.htm","70"],["http://www.bancuri.net/Categoria_Deocheate-10.htm","13"],["http://www.bancuri.net/Categoria_Diferente-21.htm","6"],["http://www.bancuri.net/Categoria_Diverse-28.htm","408"],["http://www.bancuri.net/Categoria_Doctori-31.htm","198"],["http://www.bancuri.net/Categoria_Evrei-15.htm","53"],["http://www.bancuri.net/Categoria_Gheorghe-9.htm","27"],["http://www.bancuri.net/Categoria_Homosexuali-13.htm","23"],["http://www.bancuri.net/Categoria_Ion_si_Maria-7.htm","41"],["http://www.bancuri.net/Categoria_Intrebari_si_raspunsuri-25.htm","249"],["http://www.bancuri.net/Categoria_Justitie-46.htm","21"],["http://www.bancuri.net/Categoria_Legile_lui_Murphy-48.htm","507"],["http://www.bancuri.net/Categoria_Militari-43.htm","19"],["http://www.bancuri.net/Categoria_Moldoveni-29.htm","14"],["http://www.bancuri.net/Categoria_Mosi_si_babe-50.htm","18"],["http://www.bancuri.net/Categoria_Nebuni-32.htm","13"],["http://www.bancuri.net/Categoria_Negri-30.htm","24"],["http://www.bancuri.net/Categoria_Olteni-27.htm","37"],["http://www.bancuri.net/Categoria_Pescari_si_vanatori-44.htm","44"],["http://www.bancuri.net/Categoria_Politice-22.htm","67"],["http://www.bancuri.net/Categoria_Politisti-18.htm","154"],["http://www.bancuri.net/Categoria_Radio_Erevan-1.htm","169"],["http://www.bancuri.net/Categoria_Religie-40.htm","56"],["http://www.bancuri.net/Categoria_Restaurante-47.htm","17"],["http://www.bancuri.net/Categoria_Scirboase-6.htm","8"],["http://www.bancuri.net/Categoria_Scotieni-11.htm","156"],["http://www.bancuri.net/Categoria_Seci-36.htm","6"],["http://www.bancuri.net/Categoria_Sir_si_John-37.htm","13"],["http://www.bancuri.net/Categoria_Soacre-55.htm","27"],["http://www.bancuri.net/Categoria_Somalezi-38.htm","30"],["http://www.bancuri.net/Categoria_Scoala-45.htm","48"],["http://www.bancuri.net/Categoria_Soferi-49.htm","27"],["http://www.bancuri.net/Categoria_Tarani-14.htm","17"],["http://www.bancuri.net/Categoria_Tigani-12.htm","34"],["http://www.bancuri.net/Categoria_Unguri-23.htm","15"],["http://www.bancuri.net/Categoria_Viagra-19.htm","31"]]');
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
