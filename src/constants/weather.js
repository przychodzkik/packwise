export const WMO_LABELS = {
  0: "słonecznie", 1: "prawie bezchmurnie", 2: "częściowe zachmurzenie", 3: "pochmurno",
  45: "mgła", 48: "mgła szronowa",
  51: "mżawka", 53: "umiarkowana mżawka", 55: "gęsta mżawka",
  61: "lekki deszcz", 63: "umiarkowany deszcz", 65: "silny deszcz",
  71: "lekki śnieg", 73: "umiarkowany śnieg", 75: "intensywny śnieg",
  77: "ziarna śniegu",
  80: "przelotne opady", 81: "umiarkowane przelotne opady", 82: "gwałtowne ulewy",
  85: "przelotny śnieg", 86: "silny przelotny śnieg",
  95: "burza", 96: "burza z gradem", 99: "burza z dużym gradem",
};

export const WMO_EMOJI = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "⛈️",
  71: "🌨️", 73: "🌨️", 75: "❄️", 77: "🌨️",
  80: "🌧️", 81: "🌧️", 82: "⛈️",
  85: "🌨️", 86: "❄️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

export const weatherEmoji = (code) => WMO_EMOJI[code] ?? "🌡️";
export const weatherLabel = (code) => WMO_LABELS[code] ?? "nieznane";
