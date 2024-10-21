import Groq from 'groq-sdk';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function generateCv(userInput: string): Promise<any> {
  try {
    const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: `Generate a CV ATS Friendly and professional based on the following information: ${userInput}`,
        },
      ],
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.8,
      model: 'gemma2-9b-it',
    });

    return response.choices[0]?.message?.content ?? '';
  } catch (error) {
    console.error(error);
    return 'Failed to generate CV';
  }
}

const formattedCv = (response: string) => {
  let formattedCv = '';

  const lines = response.split('\n');
  lines.forEach((line) => {
    // Hapus spasi tambahan
    line = line.trim();
    if (line === '') {
      formattedCv += '';
    } else {
      // Menghapus #
      line = line.replace(/#/g, '');
      // Mengubah ** ** menjadi <strong> </strong>
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Mengubah * menjadi -
      line = line.replace(/\*/, '-');
      // Menambahakan ke formattedCv
      formattedCv += `<p>${line}</p>`;
    }
  })

  return formattedCv;
};

const generateCvPdf = async (response: string) => {
  // Memformat response
  let checkReferences = false
  const formattedResponse = response
    .split('\n')
    .filter(e => {
      if (e.toLowerCase().includes('references')) checkReferences = true;
      if (checkReferences) return false; 
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
      !line.toLowerCase().includes('your') &&
      !line.toLowerCase().includes('note') &&
      !line.toLowerCase().includes('tips') &&
      !line.toLowerCase().includes('ats') &&
      !line.toLowerCase().includes('keep') &&
      !line.toLowerCase().includes('important')
    )
    .filter(e => e != '')
    .map(line => line.replace(/\*\*/g, '').trim())
    .map(line => line.replace(/\*/g, '-').trim())
    .map(line => line.replace(/#/g, "").trim())


  // Menyiapkan pdf
  const pdfDoc = await PDFDocument.create();
  // Mengatur font dan ukuran font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSize = 12;
  // Mengatur ukuran halaman A4 dan margin
  let page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  const margin = 50;
  let currentY = height - margin;

  // Menggambar teks ke halaman
  formattedResponse.forEach((line) => {
    // Mengukur lebar teks
    const textWidth = timesRomanFont.widthOfTextAtSize(line, fontSize);

    // Mengecek apakah teks cukup dengan lebar halaman
    if (textWidth < width - 2 * margin) { 
      // Jika tidak cukup ruang di halaman saat ini, buat halaman baru
      if (currentY - fontSize - 5 < margin) {
        page = pdfDoc.addPage([600, 800]);
        currentY = height - margin;
      }
      // Gambar teks saat ini
      page.drawText(line, {
        x: margin,
        y: currentY,
        font: timesRomanFont,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      // Menurunkan posisi Y untuk baris berikutnya
      currentY -= fontSize + 5;

    // Jika lebar teks melebihi lebar halaman
    } else {
      const words = line.split(' ');
      let currentLine = '';

      words.forEach((word) => {
        // Mengukur lebar teks
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testLineWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);

        // Mengecek apakah teks cukup dengan lebar halaman
        if (testLineWidth < width - 2 * margin) {
          // Menambahkan word ke currentLine
          currentLine = testLine;

        // Jika testLineWidth sudah melebihi lebar halaman
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
          // Menurunkan posisi Y untuk baris berikutnya
          currentY -= fontSize + 5; 
          // Mulai baris baru
          currentLine = word; 
        }
      });

      // Gambar baris terakhir jika masih ada
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
  generateCv,
  formattedCv,
  generateCvPdf,
};
