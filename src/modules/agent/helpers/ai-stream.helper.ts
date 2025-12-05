import { ReadableOptions, Transform } from 'stream'
interface StreamData {
  event: string
  data: unknown
}
export class AIStreamHelper extends Transform {
  public constructor(option?: ReadableOptions) {
    super({ ...option, objectMode: true })
  }
  public pushData(data: StreamData) {
    this.push(`event: ${data.event}\ndata: ${JSON.stringify(data.data)}\n\n`)
  }
  public _read() {
    // do nothing
  }
  public _transform(
    chunk: unknown,
    encoding: string,
    callback: (error?: Error | null, data?: unknown) => void,
  ) {
    let str = ''
    if (chunk instanceof Object) {
      str = JSON.stringify(chunk)
    } else {
      str = chunk + ''
    }
    this.push(`event: delta\ndata: ${str}\n\n`)
    callback()
  }
  public doEnd(data?: StreamData) {
    if (data) {
      this.pushData(data)
    }
    this.push(null)
  }
  public doFinish(result: StreamData) {
    this.doEnd(result)
  }
}
