import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
