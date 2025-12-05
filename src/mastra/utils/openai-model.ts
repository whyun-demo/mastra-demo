import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

type OpenAIInstance = ReturnType<typeof createOpenAICompatible>

export const openai = createOpenAICompatible({
  name: 'custom',
  baseURL: process.env.OPENAI_BASE_URL as string,
  apiKey: process.env.OPENAI_API_KEY as string,
})

export const model: ReturnType<OpenAIInstance> = openai(
  process.env.OPENAI_MODEL as string,
)
