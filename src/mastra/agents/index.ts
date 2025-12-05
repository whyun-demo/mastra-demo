import { Agent } from '@mastra/core/agent'
// import { weatherTool } from '../tools'

import { model } from '../utils/openai-model'

export const myAgent = new Agent({
  id: 'my-agent',
  name: 'My Agent',
  instructions: 'You are a helpful assistant.',
  model,
  // memory: new Memory({
  //   storage: new LibSQLStore({
  //     id: 'my-agent',
  //     url: 'file:../mastra.db', // path is relative to the .mastra/output directory
  //   }),
  //   options: {
  //     lastMessages: 10,
  //     semanticRecall: false,
  //     threads: {
  //       generateTitle: false,
  //     },
  //   },
  // }),
})
