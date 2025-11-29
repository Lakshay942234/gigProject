import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/lms.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { CandidatesService } from '../candidates/candidates.service';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly candidatesService: CandidatesService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.OPERATIONS)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll(@Query('processType') processType?: string) {
    return this.coursesService.findAll(processType);
  }

  @Get('my-progress')
  @Roles(Role.CANDIDATE)
  async getMyProgress(@CurrentUser('id') userId: string) {
    const candidate = await this.candidatesService.findByUserId(userId);
    if (!candidate) throw new Error('Candidate not found');
    return this.coursesService.getProgress(candidate.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post(':id/start')
  @Roles(Role.CANDIDATE)
  async startCourse(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const candidate = await this.candidatesService.findByUserId(userId);
    if (!candidate) throw new Error('Candidate not found');
    return this.coursesService.startCourse(candidate.id, id);
  }

  @Post(':id/complete')
  @Roles(Role.CANDIDATE)
  async completeCourse(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const candidate = await this.candidatesService.findByUserId(userId);
    if (!candidate) throw new Error('Candidate not found');
    return this.coursesService.completeCourse(candidate.id, id);
  }
}
