import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as session from "express-session"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);
  app.useStaticAssets(join(__dirname, '../../../apps/server', 'public'),{
    prefix:"/static"
  });
  app.setViewEngine("ejs");
  app.setBaseViewsDir(join(__dirname, '../../../apps/server', 'views'));
  app.listen(process.env.AppServerPort).then(()=>{
    console.log(`http://${process.env.ServerIp}:${process.env.AppServerPort}`);
  })
}
bootstrap();
