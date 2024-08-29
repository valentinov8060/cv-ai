// src/lib/generateCV.ts
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });

async function generateCV(userInput: string): Promise<string> {
  try {
    // Mengirimkan permintaan ke model bahasa
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Generate a CV ATS Friendly and professional based on the following information: ${userInput}`,
        },
      ],
      temperature: 1.0,
      top_p: 0.9,
      frequency_penalty: 2.0,
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

const formatCVResponse = (response: string) => {
  let formattedResponse = '';

  // Pisahkan setiap baris untuk pemrosesan lebih mudah
  const lines = response.split('\n');

  lines.forEach((line) => {
    // Hapus spasi tambahan
    line = line.trim();

    // Ganti **bold text** dengan <strong>bold text</strong>
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Cek untuk bagian header
    if (/^\*.*:\*$/.test(line)) {
      // Jika baris merupakan header (misalnya: *Education:*)
      const headerText = line.replace(/\*/g, '');
      formattedResponse += `<h3>${headerText}</h3><ul>`;
    } else if (/^\* .+/.test(line)) {
      // Jika baris merupakan item list (misalnya: * Email: xxx)
      const listItemText = line.replace(/^\* /, '');
      formattedResponse += `<li>${listItemText}</li>`;
    } else if (/^\t\+ .+/.test(line)) {
      // Jika baris merupakan sub-list dengan indentasi (misalnya: + Participated in ...)
      const subListItemText = line.replace(/^\t\+ /, '');
      formattedResponse += `<ul><li>${subListItemText}</li></ul>`;
    } else if (line === '') {
      // Jika ada baris kosong, tutup list jika ada yang terbuka
      if (formattedResponse.endsWith('<ul>')) {
        formattedResponse = formattedResponse.slice(0, -4) + '</ul>';
      } else if (formattedResponse.endsWith('</li>')) {
        formattedResponse += '</ul>';
      }
    } else {
      // Jika baris adalah paragraf teks biasa
      formattedResponse += `<p>${line}</p>`;
    }
  });

  // Pastikan semua tag terbuka ditutup
  if (formattedResponse.includes('<ul>') && !formattedResponse.includes('</ul>')) {
    formattedResponse += '</ul>';
  }

  return formattedResponse;
};

export {
  generateCV,
  formatCVResponse,
};
