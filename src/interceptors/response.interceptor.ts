import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()
    return next.handle().pipe(
      map((data: { code: number }) => {
        if (data && Number.isInteger(data.code)) {
          response.locals.code = data.code
          return data
        }
        response.locals.code = 0
        if (
          data instanceof StreamableFile ||
          data instanceof Buffer ||
          typeof data === 'string'
        ) {
          return data
        }
        return {
          code: 0,
          data,
        }
      }),
    )
  }
}
