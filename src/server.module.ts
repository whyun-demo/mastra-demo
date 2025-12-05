import { Module } from '@nestjs/common'
import { AgentModule } from './modules'

@Module({
  imports: [AgentModule],
})
export class ServerModule {}
