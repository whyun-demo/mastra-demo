import { NestFactory } from '@nestjs/core'

import { setTimeout } from 'timers/promises'
import { HttpExceptionFilter } from './filters/http-exception.filter'

import { validationPipe } from './common/pipes/validation.pipe'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import path from 'path'
import fs from 'fs'
import { version, name } from '../package.json'
import { ServerModule } from './server.module'
import config from 'config'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { Slogger } from 'node-slogger'

const _env = process.env
const logger = new Slogger()
process.on('uncaughtException', async (err) => {
  // eslint-disable-next-line no-console
  console.error('UncaughtException:', err)
  await setTimeout(1000)
  process.exit(1)
})

process.on('unhandledRejection', async (err) => {
  // eslint-disable-next-line no-console
  console.error('unhandledRejection:', err)
  await setTimeout(1000)
  process.exit(2)
})

async function bootstrap() {
  const app = await NestFactory.create(ServerModule)
  app.enableCors()
  app.useGlobalFilters(new HttpExceptionFilter())

  app.useGlobalPipes(validationPipe)
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
  app.use(cookieParser())
  if (_env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle(name)
      .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
      })
      .setVersion(version)
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('swagger-doc', app, document)
    app.use('/docs', (req, res) => {
      fs.createReadStream(path.join(__dirname, './static/docs.html')).pipe(res)
    })
  }
  logger.info('begin to start')
  await app.listen(config.get('port'), () => {
    logger.info(
      `Server listening port on http://localhost:${config.get('port')}. NODE_ENV: ${
        _env.NODE_ENV
      }`,
    )
  })
  return app
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
