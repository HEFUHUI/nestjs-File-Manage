import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MajorModule } from '@libs/major';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [MajorModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
