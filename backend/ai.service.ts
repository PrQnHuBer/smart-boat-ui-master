import { getWeather } from "./weather.service";

export async function askAI(message: string) {

  // 🔥 logic ฉลาดแบบง่าย
  if (message.includes("อากาศ") || message.includes("weather")) {
    const weather = await getWeather();

    return `ตอนนี้อุณหภูมิ ${weather.temp}°C และ ${weather.desc}`;
  }

  // fallback → คุยกับ AI จริง
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "llama3",
      prompt: message,
      stream: false
    }),
  });

  const data = await res.json();
  return data.response;
}