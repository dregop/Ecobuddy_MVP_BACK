// src/routes/rag.route.ts
import { FastifyInstance } from 'fastify'
import { answerWithRag } from '../services/rag/answer.service'

export default async function ragRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const { question } = req.body as { question: string }

    if (!question) return res.status(400).send({ error: 'Missing question' })

    const response = await answerWithRag(question)
    return res.send(response)
  })
}
