// src/lib/generateCV.ts
import Groq from 'groq-sdk';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function generateCV(userInput: string): Promise<string> {
  try {
    const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });
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

const generatePDF = async (response: string) => {
  // Memformat response
  let checkNote = false
  const formattedResponse = response
    .split('\n')
    .filter(e => {
      if (e.toLowerCase().includes('note')) checkNote = true;
      if (checkNote) return false; 
      return true;
    })
    .filter(
      line => !line.toLowerCase().includes('here') && 
      !line.toLowerCase().includes('please') &&
      !line.toLowerCase().includes('sample') &&
      !line.toLowerCase().includes('cv') &&
      !line.toLowerCase().includes('format') &&
      !line.toLowerCase().includes('use') &&
      !line.toLowerCase().includes('customize') &&
      !line.toLowerCase().includes('your')
    )
    .filter(e => !(e == ''))
    .map(line => line.replace(/\*\*/g, '').trim())
    .map(line => line.replace(/\*/g, '-').trim())

  // Menyiapkan pdf
  const pdfDoc = await PDFDocument.create();

  // Mengatur ukuran halaman A4
  let page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  // Mengatur font dan ukuran font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSize = 12;

  // Menggambar teks ke halaman
  const margin = 50;
  let currentY = height - margin;
  formattedResponse.forEach((line) => {
    // Mengukur lebar teks saat ini
    const textWidth = timesRomanFont.widthOfTextAtSize(line, fontSize);

    if (textWidth < width - 2 * margin) { // Mengurangi margin dari kiri dan kanan
      if (currentY - fontSize - 5 < margin) {
        // Jika tidak cukup ruang di halaman saat ini, buat halaman baru
        page = pdfDoc.addPage([600, 800]);
        currentY = height - margin;
      }
      page.drawText(line, {
        x: margin,
        y: currentY,
        font: timesRomanFont,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      currentY -= fontSize + 5; // Menurunkan posisi Y untuk baris berikutnya
    } else {
      // Jika lebar teks melebihi lebar halaman, bungkus teksnya
      const words = line.split(' ');
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testLineWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);

        if (testLineWidth < width - 2 * margin) {
          currentLine = testLine;
        } else {
          // Jika tidak cukup ruang di halaman saat ini, buat halaman baru
          if (currentY - fontSize - 5 < margin) {
            page = pdfDoc.addPage([600, 800]);
            currentY = height - margin;
          }

          // Gambar teks saat ini
          page.drawText(currentLine, {
            x: margin,
            y: currentY,
            font: timesRomanFont,
            size: fontSize,
            color: rgb(0, 0, 0),
          });
          currentY -= fontSize + 5; // Menurunkan posisi Y untuk baris berikutnya
          currentLine = word; // Mulai baris baru
        }
      });

      // Gambar baris terakhir jika ada
      if (currentLine) {
        // Jika tidak cukup ruang di halaman saat ini, buat halaman baru
        if (currentY - fontSize - 5 < margin) {
          page = pdfDoc.addPage([600, 800]);
          currentY = height - margin;
        }

        page.drawText(currentLine, {
          x: margin,
          y: currentY,
          font: timesRomanFont,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
        currentY -= fontSize + 5;
      }
    }
  });

  // Menyimpan dokumen sebagai byte array
  const pdfBytes = await pdfDoc.save();

  // Membuat Blob dari byte array
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  // Membuat URL objek untuk Blob tersebut
  const url = URL.createObjectURL(blob);

  // Membuat elemen tautan unduhan
  const link = document.createElement('a');
  link.href = url;
  link.download = 'CV-AI.pdf';
  
  // Memicu klik tautan untuk mengunduh PDF
  link.click();

  // Membersihkan URL objek
  URL.revokeObjectURL(url);
};

export {
  generateCV,
  formatCVResponse,
  generatePDF,
};
