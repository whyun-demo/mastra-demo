import { Mastra } from '@mastra/core/mastra'
import { PinoLogger } from '@mastra/loggers'
import { LibSQLStore } from '@mastra/libsql'

import { myAgent } from './agents'
import {
  defaultExporter,
  laminarExporter,
  langfuseExporter,
  telemetry,
} from './telemetry-config'
import { weatherWorkflow } from './workflows'
import { Observability } from '@mastra/observability'

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { myAgent },
  storage: new LibSQLStore({
    id: 'mastra',
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ':memory:',
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: new Observability({
    // default: { enabled: true },
    configs: {
      langfuse: {
        ...telemetry,
        serviceName: 'langfuse',
        exporters: [langfuseExporter, defaultExporter],
      },
      laminar: {
        ...telemetry,
        serviceName: 'otel',
        exporters: [laminarExporter, defaultExporter],
      },
    },
    configSelector: () => {
      return 'langfuse'
    },
  }),
})
