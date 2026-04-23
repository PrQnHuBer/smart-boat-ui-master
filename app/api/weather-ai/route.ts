import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { weatherData } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in Environment Variables");
    }

    const prompt = `คุณคือ AI วิเคราะห์สภาพอากาศสำหรับการเดินเรือ ข้อมูลปัจจุบัน: อุณหภูมิ ${weatherData.temp}, ความชื้น ${weatherData.humidity}, ลม ${weatherData.wind}. 
    จงวิเคราะห์และตอบกลับเป็น JSON ภาษาไทยเท่านั้น ห้ามมีคำบรรยายอื่น ห้ามใช้ markdown:
    {
      "condition": "คำสรุปสั้นๆ (เช่น ท้องฟ้าแจ่มใส)",
      "emoji": "☀️",
      "temp": "${weatherData.temp}",
      "humidity": "${weatherData.humidity}",
      "wind": "${weatherData.wind}",
      "advice": "คำแนะนำการเดินเรือสั้นๆ"
    }`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      }),
    });

    const data = await response.json();
    
    // ตรวจสอบว่า Gemini ตอบกลับมาถูกต้องหรือไม่
    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
      throw new Error("Invalid response from Gemini");
    }

    const aiText = data.candidates[0].content.parts[0].text;
    const aiResult = JSON.parse(aiText);

    return NextResponse.json(aiResult);
  } catch (error: any) {
    console.error("Gemini Error:", error.message);
    return NextResponse.json({ 
      condition: "Error", 
      emoji: "⚠️", 
      temp: "--", 
      humidity: "--", 
      wind: "--", 
      advice: "ไม่สามารถเชื่อมต่อ Gemini API ได้: " + error.message 
    }, { status: 500 });
  }
}