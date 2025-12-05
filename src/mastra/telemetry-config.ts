import { LangfuseExporter } from '@mastra/langfuse'
import {
  DefaultExporter,
  SamplingStrategy,
  SamplingStrategyType,
} from '@mastra/observability'
import { OtelExporter } from '@mastra/otel-exporter'

export const laminarExporter = new OtelExporter({
  provider: {
    laminar: {
      apiKey: process.env.OTEL_EXPORTER_OTLP_API_KEY,
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    },
  },
})

export const langfuseExporter = new LangfuseExporter({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL,
})
export const defaultExporter = new DefaultExporter()
export const telemetry = {
  serviceName: 'agent-otel',
  sampling: {
    type: SamplingStrategyType.ALWAYS,
  } as SamplingStrategy,
}
