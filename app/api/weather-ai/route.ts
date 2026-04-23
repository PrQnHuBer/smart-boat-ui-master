import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { weatherData } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `คุณคือ AI วิเคราะห์เรือ ข้อมูล: อุณหภูมิ ${weatherData.temp}, ความชื้น ${weatherData.humidity}, ลม ${weatherData.wind}.
    จงตอบเป็น JSON ภาษาไทยเท่านั้น ห้ามมีคำเกริ่น ห้ามใช้ markdown:
    {
      "condition": "สรุปอากาศสั้นๆ",
      "emoji": "☀️",
      "temp": "${weatherData.temp}",
      "humidity": "${weatherData.humidity}",
      "wind": "${weatherData.wind}",
      "advice": "คำแนะนำสั้นๆ สำหรับคนขับเรือ"
    }`;

    // เรียกใช้ Gemini API (รุ่น flash จะเร็วและฟรี)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      }),
    });

    const data = await response.json();
    
    // ดึงเนื้อหา JSON จากโครงสร้างของ Gemini
    const aiText = data.candidates[0].content.parts[0].text;
    const aiResult = JSON.parse(aiText);

    return NextResponse.json(aiResult);
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ 
      condition: "Error", emoji: "⚠️", 
      temp: "--", humidity: "--", wind: "--", 
      advice: "ไม่สามารถเชื่อมต่อ Gemini API ได้" 
    });
  }
}