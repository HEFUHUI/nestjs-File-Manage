import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MajorModule } from '@libs/major';
import { EventsGateway } from './events.gateway';
import { FilesModule } from './files/files.module';
import { ProblemModule } from './problem/problem.module';

@Module({
  imports: [MajorModule,FilesModule, ProblemModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {
  constructor(){}
}
