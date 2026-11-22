import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Проверка доступности API и базы данных' })
  async check(): Promise<{
    status: 'ok' | 'degraded'
    db: 'up' | 'down'
    uptime: number
    timestamp: string
  }> {
    let db: 'up' | 'down' = 'down'

    try {
      await this.prisma.$queryRaw`SELECT 1`
      db = 'up'
    } catch {
      db = 'down'
    }

    return {
      status: db === 'up' ? 'ok' : 'degraded',
      db,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    }
  }
}
