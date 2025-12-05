import { ValidationPipe } from '@nestjs/common'
import { CUSTOM_CODE } from '../constants'
import { CustomError } from '../utils/custom.error'
import { Slogger } from 'node-slogger'
const logger = new Slogger()

export const validationPipe = new ValidationPipe({
  exceptionFactory: (errors) => {
    logger.warn('req params invalid', errors)
    return new CustomError(CUSTOM_CODE.PARAMETER_VERIFICATION)
  },
})
