import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class ResponseLegacyInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()
    return next.handle().pipe(
      tap((body: { code: number }) => {
        if (body && Number.isInteger(body.code)) {
          response.locals.code = body.code
        }
      }),
    )
  }
}
