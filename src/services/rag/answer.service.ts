import { openai } from "../openai"
import { prisma } from "../prisma"
import { getEmbedding } from "./embedding.service"

export async function answerWithRag(question: string) {
  // Étape 1 : Créer l'embedding de la question
  const questionEmbedding = await getEmbedding(question)

  // Étape 2 : Trouver les chunks les plus proches
  const chunks = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      "id", "source", "sourceUrl", "title", "text", "language", "createdAt", 
      embedding <#> $1::vector AS distance
    FROM "RagChunk"
    ORDER BY embedding <#> $1::vector
    LIMIT 5
  `, questionEmbedding)
  
  

  // Étape 3 : Construire le contexte
  const context = chunks.map(c => c.text).join('\n---\n')

  const prompt = `
Tu es un expert en climat. Réponds précisément à la question ci-dessous en t’appuyant uniquement sur le contexte fourni. Si le contexte ne contient pas l'information, dis-le.

Contexte :
${context}

Question :
${question}
  `.trim()

  // Étape 4 : Appeler GPT
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  })

  return {
    answer: completion.choices[0].message.content,
    sources: chunks.map(c => c.sourceUrl),
  }
}
