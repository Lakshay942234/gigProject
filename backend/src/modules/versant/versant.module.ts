import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VersantService } from './versant.service';
import { VersantController } from './versant.controller';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
  imports: [HttpModule, CandidatesModule],
  controllers: [VersantController],
  providers: [VersantService],
  exports: [VersantService],
})
export class VersantModule {}
