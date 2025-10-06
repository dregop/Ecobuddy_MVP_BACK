import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import fs from 'fs/promises'

export async function extractTextFromPdf(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath)
    const uint8array = new Uint8Array(buffer)
    const pdf = await pdfjsLib.getDocument({ data: uint8array }).promise

  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item: any) => item.str).join(' ')
    text += pageText + '\n\n'
  }

  return text
}
