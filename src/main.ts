import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('CMS API')
    .setDescription('API documentation for CMS application')
    .setVersion('1.0')
    .addBasicAuth()
    .addBearerAuth()
    .addServer('/cms-api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const docUrlVersion = Date.now().toString();

  app.use('/cms-api/swagger', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use('/cms-api/swagger-json', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  SwaggerModule.setup('cms-api/swagger', app, document, {
    jsonDocumentUrl: '/cms-api/swagger-json',
    swaggerOptions: {
      persistAuthorization: true,
      urls: [{ url: `/cms-api/swagger-json?v=${docUrlVersion}`, name: 'v1' }],
    },
  });
  app.setGlobalPrefix('cms-api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
