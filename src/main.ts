import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO: Add proper CORS origin when going to production
  app.enableCors({ origin: '*' });
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === 'dev') {
    const config = new DocumentBuilder()
      .setTitle('Lendesk Coding Challenge')
      .setDescription('Documentation for Lendesk Coding Challenge')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    console.log('Documentation running on http://localhost:4000/docs');
  }

  await app.listen(4000);
  console.log('Server running on http://localhost:4000');
}

bootstrap();
