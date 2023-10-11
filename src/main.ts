import { AppModule } from '@modules/app';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupApp } from '@utils/setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);

  if (process.env.NODE_ENV === 'dev') {
    const config = new DocumentBuilder()
      .setTitle('Lendesk Coding Challenge')
      .setDescription('Documentation for Lendesk Coding Challenge')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    });
  }

  const port = 4000;
  await app.listen(port);

  const server = app.getHttpServer();
  const address =
    server.address().address === '::' ? 'localhost' : server.address().address;

  console.log(
    `Server running on http://${address}:${port}.${
      process.env.NODE_ENV === 'dev' &&
      ` You can view the docs at http://${address}:${port}/docs`
    }`,
  );
}

bootstrap();
