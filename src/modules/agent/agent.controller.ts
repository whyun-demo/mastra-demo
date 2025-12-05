import { Controller, Get, Header, Query, StreamableFile } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { mastra } from '../../mastra'
import { AIStreamHelper } from './helpers/ai-stream.helper'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Readable } from 'stream'
import { WeatherResponseDTO } from './dto/weather.dto'
import { Slogger } from 'node-slogger'
import { WeatherCtx } from './interfaces/weather-ctx.interface'
import { RequestContext } from '@mastra/core/di'
const logger = new Slogger()
@Controller('agent')
@ApiTags('智能体相关')
export class AgentController {
  @Get('ask')
  @Header('Content-Type', 'text/event-stream')
  public async testAgent(@Query('q') q: string) {
    const streamHelper = new AIStreamHelper()
    streamHelper.pushData({
      event: 'event',
      data: {
        type: 'start',
        conversation_id: '123',
        created_at: new Date().toISOString(),
      },
    })
    const stream = await mastra.getAgent('myAgent').stream([
      {
        role: 'user',
        content: q,
      },
    ])
    const deltaId = randomUUID()
    streamHelper.pushData({
      event: 'event',
      data: {
        type: 'delta_start',
        conversation_id: '123',
        delta_id: deltaId,
      },
    })

    const readable = Readable.from(stream.textStream)
    readable.pipe(streamHelper, { end: false })
    readable.on('end', () => {
      streamHelper.pushData({
        event: 'event',
        data: {
          type: 'delta_end',
          conversation_id: '123',
          delta_id: deltaId,
        },
      })
      streamHelper.doEnd()
    })
    readable.on('error', (err) => {
      streamHelper.pushData({
        event: 'error',
        data: err.message,
      })
      streamHelper.doEnd()
    })

    return new StreamableFile(streamHelper)
  }
  @Get('ask-streamed')
  public async askStreamed(@Query('q') q: string) {
    const stream = await mastra.getAgent('myAgent').stream([
      {
        role: 'user',
        content: q,
      },
    ])

    const readable = Readable.from(stream.textStream)
    return new StreamableFile(readable)
  }
  @Get('ask-blocked')
  public async askBlocked(@Query('q') q: string) {
    const result = await mastra.getAgent('myAgent').generate([
      {
        role: 'user',
        content: q,
      },
    ])
    return result.text
  }
  // @Public()
  // @Get('weather')
  // @ApiOperation({
  //   summary: '不推荐使用的例子',
  //   deprecated: true,
  // })
  // @Header('Content-Type', 'text/event-stream')
  // public async weather(@Query('q') q: string) {
  //   const streamHelper = new AIStreamHelper()
  //   const workflow = mastra.getWorkflow('weatherWorkflow')
  //   const run = workflow.createRun({})
  //   const { stream } = run.stream({
  //     inputData: {
  //       city: q,
  //     },
  //   })
  //   streamHelper.pushData({
  //     event: 'event',
  //     data: {
  //       type: 'start',
  //       conversation_id: '123',
  //       created_at: new Date().toISOString(),
  //     },
  //   })
  //   const deltaId = randomUUID()
  //   streamHelper.pushData({
  //     event: 'event',
  //     data: {
  //       type: 'delta_start',
  //       conversation_id: '123',
  //       delta_id: deltaId,
  //     },
  //   })

  //   try {
  //     const readable = Readable.from(stream)
  //     readable.pipe(streamHelper, { end: false })
  //     readable.on('end', () => {
  //       streamHelper.pushData({
  //         event: 'event',
  //         data: {
  //           type: 'delta_end',
  //           conversation_id: '123',
  //           delta_id: deltaId,
  //         },
  //       })
  //       streamHelper.doEnd()
  //     })
  //   } catch (err) {
  //     streamHelper.pushData({
  //       event: 'error',
  //       data: err.message,
  //     })
  //     streamHelper.doEnd()
  //   }

  //   return new StreamableFile(streamHelper)
  // }

  @Get('weather2')
  @ApiOperation({
    summary: '天气查询',
    description: `天气查询, API 参数风格参考了
    [Agent API定义](https://flowin.cn/doc/83634fc7939a43dab8d2c634932191c5?pid=c28c78a05d044c7a8af6772ac53ffb9f) ,
    但是为了演示方便没有严格照搬。
    `,
  })
  @Header('Content-Type', 'text/event-stream')
  public async weather2(@Query() query: WeatherResponseDTO) {
    const streamHelper = new AIStreamHelper()
    const workflow = mastra.getWorkflow('weatherWorkflow')
    const run = await workflow.createRun({})
    const conversationId = query.conversation_id || randomUUID()
    const requestContext = new RequestContext<WeatherCtx>()
    requestContext.set('streamHelper', streamHelper)
    requestContext.set('conversationId', conversationId)
    streamHelper.pushData({
      event: 'event',
      data: {
        type: 'start',
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
      },
    })

    run
      .start({
        inputData: {
          city: query.city,
        },
        requestContext,
      })
      .then((_result) => {
        if (_result.status === 'failed') {
          streamHelper.doEnd({
            event: 'event',
            data: {
              type: 'error',
              detail: _result.error,
            },
          })
          return
        }

        streamHelper.doEnd({
          event: 'event',
          data: {
            type: 'end',
            conversation_id: conversationId,
            detail: {},
          },
        })
      })
      .catch((err) => {
        logger.error('weather2 error', err)
        streamHelper.pushData({
          event: 'event',
          data: {
            type: 'error',
            detail: err.message,
          },
        })
        streamHelper.doEnd()
      })

    return new StreamableFile(streamHelper)
  }
}
