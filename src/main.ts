import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';

async function bootstrap() {
  const portIP = process.env.BE_PORT;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const allowedOrigins = '*'; // Add your frontend's production URL here when deploying

  // Enable CORS for your NestJS application
  app.enableCors({
    origin: allowedOrigins,
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    methods: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  const config = new DocumentBuilder()
    .setTitle('internsip-screening')
    .setDescription('internsip-screening API description')
    .setVersion('1.0')
    .addTag('internsip-screening')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cors());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(path.join(__dirname, '../uploads'));

  await app.listen(portIP);
  console.log('Server is running on port: ', portIP);
}
bootstrap();
