import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
export class ResultDTO {
  @ApiProperty({
    description: '状态码, 0 表示成功',
    example: 0,
  })
  code: number

  @ApiPropertyOptional({ description: '错误信息' })
  msg?: string
}
