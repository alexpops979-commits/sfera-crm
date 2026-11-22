import 'reflect-metadata'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  const port = config.get<number>('PORT') ?? 3000
  const webOrigin = config.get<string>('WEB_ORIGIN') ?? 'http://localhost:5173'

  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))
  app.use(compression())
  app.use(cookieParser())

  app.setGlobalPrefix('api/v1')
  app.enableCors({ origin: webOrigin, credentials: true })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.enableShutdownHooks()

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Сфера CRM API')
    .setDescription('Multi-tenant CRM: клиенты, сделки, воронка, задачи, аудит')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addCookieAuth('refresh_token')
    .build()

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig), {
    swaggerOptions: { persistAuthorization: true },
  })

  await app.listen(port)

  Logger.log(`API:     http://localhost:${port}/api/v1`, 'Bootstrap')
  Logger.log(`Swagger: http://localhost:${port}/docs`, 'Bootstrap')
}

void bootstrap()
