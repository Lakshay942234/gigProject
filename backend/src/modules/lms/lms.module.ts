import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
    imports: [CandidatesModule],
    controllers: [CoursesController, QuizzesController],
    providers: [CoursesService, QuizzesService],
    exports: [CoursesService, QuizzesService],
})
export class LmsModule { }
