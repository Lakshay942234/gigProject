import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';
import { GigsModule } from '../gigs/gigs.module';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
    imports: [GigsModule, CandidatesModule],
    controllers: [WorkController],
    providers: [WorkService],
    exports: [WorkService],
})
export class WorkModule { }
