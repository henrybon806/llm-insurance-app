import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

function parsePdfWithPdf2Json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", errData => {
      reject(new Error(errData.parserError.message));
    });

    pdfParser.on("pdfParser_dataReady", pdfData => {
      try {
        const texts: string[] = [];
        pdfData.Pages.forEach((page: any) => {
          page.Texts.forEach((textBlock: any) => {
            const line = textBlock.R.map((r: any) =>
              decodeURIComponent(r.T)
            ).join("");
            texts.push(line);
          });
        });
        resolve(texts.join(" "));
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = (data as any).get("file") as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "pdf") {
    try {
      const text = await parsePdfWithPdf2Json(buffer);
      return NextResponse.json({ text });
    } catch (err: any) {
      return NextResponse.json(
        { error: "Failed to parse PDF: " + err.message },
        { status: 400 }
      );
    }
  }

  if (extension === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return NextResponse.json({ text: result.value });
  }

  if (extension === "txt") {
    return NextResponse.json({ text: buffer.toString("utf-8") });
  }

  return NextResponse.json(
    { error: "Unsupported file type" },
    { status: 400 }
  );
}