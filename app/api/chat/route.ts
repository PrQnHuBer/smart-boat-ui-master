import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { weatherData } = await request.json();

    // สร้าง Prompt ส่งให้ Ollama
    const prompt = `
      คุณคือผู้เชี่ยวชาญด้านการเดินเรือ วิเคราะห์ข้อมูลสภาพอากาศต่อไปนี้:
      อุณหภูมิ: ${weatherData.temp}°C, ความเร็วลม: ${weatherData.wind} knot, สภาพอากาศ: ${weatherData.condition}
      ช่วยสรุปสั้นๆ ว่าปลอดภัยสำหรับการนำเรือออกหรือไม่ และควรระวังอะไรเป็นพิเศษ (ตอบเป็นภาษาไทย)
    `;

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "llama3", // ชื่อโมเดลที่โหลดในขั้นตอนที่ 1
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ advice: data.response });

  } catch (error) {
    return NextResponse.json({ advice: "ขออภัย AI ไม่สามารถเชื่อมต่อได้ในขณะนี้" }, { status: 500 });
  }
}