import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { CustomError } from '../common/utils/custom.error'
import type { Response } from 'express'
import { EventStreamError } from '../common/utils/event-stream.error'
import { Readable } from 'stream'
import { Slogger } from 'node-slogger'
const logger = new Slogger()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp()
    const response: Response = ctx.getResponse<Response>()
    if (exception instanceof EventStreamError) {
      response.locals.code = exception.errorCode.code
      response.set('Content-Type', 'event-stream')
      response.set('Cache-Control', 'no-cache')
      const stream = new Readable()
      stream.pipe(response)
      stream.push(JSON.stringify(exception.errorCode))
      stream.push(null)
    } else if (exception instanceof CustomError) {
      response.locals.code = exception.errorCode.code
      response.json(exception.errorCode)
    } else if (exception instanceof HttpException) {
      response.locals.code = -2
      const status = exception.getStatus()
      response.status(status).send(exception.getResponse())
      if (status >= 500) {
        logger.error('inner exception from module', exception)
      }
    } else {
      response.locals.code = -3
      logger.error('unknown exception from module,', exception)
      response.sendStatus(500)
    }
  }
}
