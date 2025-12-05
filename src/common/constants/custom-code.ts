export const CUSTOM_CODE = {
  SUCCESS: { code: 0, msg: '成功' },
  UNKNOWN: { code: 1, msg: '请求异常' },

  PARAMETER_VERIFICATION: {
    code: 4,
    msg: '参数错误',
  },
}

export interface IErrorCode {
  code: number
  msg: string
}
export interface IResponseData extends IErrorCode {
  data?: unknown
}
