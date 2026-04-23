import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { weatherData } = await request.json();
    
    // ใส่ API Key อันใหม่ของคุณที่นี่
    const apiKey = "AIzaSyCtirWeHeux0-VAhmVB6Hb_euerpEVJzio"; 

    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ 
        condition: "Key Missing", 
        advice: "โปรดเช็คการใส่ API Key" 
      }, { status: 500 });
    }

    const prompt = `วิเคราะห์อากาศเรือ: อุณหภูมิ ${weatherData.temp}, ลม ${weatherData.wind}. 
    ตอบกลับเป็น JSON ภาษาไทยเท่านั้น ห้ามมีคำบรรยายอื่น ห้ามมี markdown:
    {
      "condition": "สรุปสั้นๆ",
      "emoji": "☀️",
      "temp": "${weatherData.temp}",
      "humidity": "${weatherData.humidity}",
      "wind": "${weatherData.wind}",
      "advice": "คำแนะนำสั้นๆ 1 ประโยค"
    }`;

    // กลับมาใช้ v1beta และใช้ชื่อโมเดลแบบเจาะจงเวอร์ชัน 001 หรือ 002
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json",
          }
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ 
        condition: "API Error", 
        advice: "Google แจ้งว่า: " + data.error.message 
      });
    }

    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
      throw new Error("AI ไม่ส่งข้อมูลกลับมา");
    }

    const aiText = data.candidates[0].content.parts[0].text;
    const aiResult = JSON.parse(aiText);

    return NextResponse.json(aiResult);

  } catch (error: any) {
    console.error("Backend Error:", error);
    return NextResponse.json({ 
      condition: "Error", 
      advice: "ระบบขัดข้อง: " + error.message 
    });
  }
}