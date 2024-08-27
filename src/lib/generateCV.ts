// src/lib/generateCV.ts
import Groq from 'groq-sdk';

// Membuat instance dari Groq dengan API key
const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });

export async function generateCV(userInput: string): Promise<string> {
  try {
    // Mengirimkan permintaan ke model bahasa
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Generate a CV based on the following information: ${userInput}`,
        },
      ],
      model: 'llama3-8b-8192', // Pastikan model yang Anda gunakan sesuai dengan yang tersedia di SDK
    });

    // Mengambil hasil dari response
    const cvContent = response.choices[0]?.message?.content || '';

    return cvContent;
  } catch (error) {
    console.error('Error generating CV with GROQ SDK:', error);
    throw new Error('Failed to generate CV');
  }
}
