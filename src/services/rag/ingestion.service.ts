import { PrismaClient } from '@prisma/client'
import { extractTextFromPdf } from './parsePdf'
import { getEmbedding } from './embedding.service'
import { chunkText } from './utils'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

export async function ingestPdfFile(filePath: string, source: string, sourceUrl: string) {
  const text = await extractTextFromPdf(filePath)
  const chunks = await chunkText(text, 500)
  console.log(`Découpé en ${chunks.length} chunks`)

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk)
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO "RagChunk" (
        id, source, "sourceUrl", title, text, embedding, language, "createdAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, NOW()
      )
    `, randomUUID(), source, sourceUrl, 'Section inconnue', chunk, embedding, 'fr')
  }
}
