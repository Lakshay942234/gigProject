import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto, SubmitQuizDto } from './dto/lms.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { CandidatesService } from '../candidates/candidates.service';

@Controller('quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly candidatesService: CandidatesService,
  ) {}

  @Post('course/:courseId')
  @Roles(Role.ADMIN, Role.OPERATIONS)
  create(
    @Param('courseId') courseId: string,
    @Body() createQuizDto: CreateQuizDto,
  ) {
    return this.quizzesService.create(courseId, createQuizDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Post(':id/submit')
  @Roles(Role.CANDIDATE)
  async submit(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() submitDto: SubmitQuizDto,
  ) {
    const candidate = await this.candidatesService.findByUserId(userId);
    if (!candidate) throw new Error('Candidate not found');
    return this.quizzesService.submit(candidate.id, id, submitDto);
  }
}
