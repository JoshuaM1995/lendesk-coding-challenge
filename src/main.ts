import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { AppModule } from '@modules/app';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get('Reflector');

  // TODO: Add proper CORS origin when going to production
  app.enableCors({ origin: '*' });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  // Add JWT bearer authentication to all routes by default
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      // Exclude all properties by default in case we forget to use the @Exclude() decorator on sensitive fields
      strategy: 'excludeAll',
    }),
  );

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
