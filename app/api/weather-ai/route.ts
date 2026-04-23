import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { weatherData } = await request.json();

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "phi3",
        prompt: `คุณคือระบบสมองกลเรืออัจฉริยะ 
        ข้อมูลอากาศปัจจุบัน: อุณหภูมิ ${weatherData.temp}, ความชื้น ${weatherData.humidity}, ลม ${weatherData.wind}
        
        จงตอบกลับเป็น JSON ภาษาไทยตามรูปแบบนี้เท่านั้น (ห้ามมีข้อความอื่น):
        {
          "condition": "คำสรุปอากาศสั้นๆ (เช่น แดดจ้าคลื่นสงบ)",
          "emoji": "☀️",
          "temp": "${weatherData.temp}",
          "humidity": "${weatherData.humidity}",
          "wind": "${weatherData.wind}",
          "advice": "คำแนะนำการเดินเรือสั้นๆ"
        }`,
        format: "json",
        stream: false,
      }),
    });

    const data = await response.json();
    const aiResult = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;

    return NextResponse.json(aiResult);
  } catch (error) {
    return NextResponse.json({ status: "Error" }, { status: 500 });
  }
}