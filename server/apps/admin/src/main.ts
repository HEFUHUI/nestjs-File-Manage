import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // NestFactory
  const app = await NestFactory.create(AppModule);
  // app.useWebSocketAdapter(new WsAdapter(app))
  // http.createServer(app);
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('cats')
    .build();
  app.useGlobalPipes(new ValidationPipe({
      transform:true
  }))
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);
  app.listen(process.env.AdminServerPort||3000).then(()=>{
    console.log(`http://127.0.0.1:${process.env.AdminServerPort}`);
  })
}
bootstrap();
