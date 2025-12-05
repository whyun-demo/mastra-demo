import { IErrorCode, IResponseData } from '../constants'

class CustomError extends Error {
  public readonly errorCode: IResponseData
  public constructor(errDesc: IErrorCode, data?: unknown) {
    super(errDesc.msg)
    this.errorCode = { ...errDesc, data }
  }
}

export { CustomError }
