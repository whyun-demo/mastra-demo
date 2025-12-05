import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class WeatherResponseDTO {
  @ApiProperty({
    description: 'city',
    example: 'new york',
  })
  @IsNotEmpty()
  city: string

  @ApiPropertyOptional({
    description: 'conversation id',
    example: '123',
  })
  conversation_id?: string

  @ApiPropertyOptional({
    description: 'request id',
    example: '123',
  })
  req_id?: string
}
