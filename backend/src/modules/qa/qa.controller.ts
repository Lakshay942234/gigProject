import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { QaService } from './qa.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/qa.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('qa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Post()
  @Roles(Role.QA, Role.ADMIN, Role.OPERATIONS)
  create(
    @CurrentUser('id') userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.qaService.create(userId, createReviewDto);
  }

  @Get()
  @Roles(Role.QA, Role.ADMIN, Role.OPERATIONS)
  findAll(@Query('reviewerId') reviewerId?: string) {
    return this.qaService.findAll(reviewerId);
  }

  @Get(':id')
  @Roles(Role.QA, Role.ADMIN, Role.OPERATIONS, Role.CANDIDATE)
  findOne(@Param('id') id: string) {
    return this.qaService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.QA, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.qaService.update(id, updateReviewDto);
  }
}
