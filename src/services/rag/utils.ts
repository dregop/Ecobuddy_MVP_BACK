import { encode } from 'gpt-tokenizer' // ou 'gpt-3-encoder' si tu préfères

export async function chunkText(text: string, maxTokens = 500): Promise<string[]> {
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 30)
  const chunks: string[] = []
  let currentChunk: string[] = []
  let tokenCount = 0

  for (const para of paragraphs) {
    const tokens = encode(para)
    if (tokenCount + tokens.length > maxTokens) {
      chunks.push(currentChunk.join('\n\n'))
      currentChunk = [para]
      tokenCount = tokens.length
    } else {
      currentChunk.push(para)
      tokenCount += tokens.length
    }
  }

  if (currentChunk.length) chunks.push(currentChunk.join('\n\n'))

  return chunks
}
