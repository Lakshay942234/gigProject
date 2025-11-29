import { Module } from '@nestjs/common';
import { QaService } from './qa.service';
import { QaController } from './qa.controller';
import { WorkModule } from '../work/work.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [WorkModule, UsersModule],
  controllers: [QaController],
  providers: [QaService],
  exports: [QaService],
})
export class QaModule {}
