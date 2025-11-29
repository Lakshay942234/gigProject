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
import { GigsService } from './gigs.service';
import {
  CreateGigDto,
  UpdateGigDto,
  CreateApplicationDto,
} from './dto/gig.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, GigStatus } from '@prisma/client';

@Controller('gigs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GigsController {
  constructor(private readonly gigsService: GigsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OPERATIONS)
  create(
    @CurrentUser('id') userId: string,
    @Body() createGigDto: CreateGigDto,
  ) {
    return this.gigsService.create(userId, createGigDto);
  }

  @Get()
  findAll(@Query('status') status?: GigStatus) {
    return this.gigsService.findAll(status);
  }

  @Get('my-applications')
  @Roles(Role.CANDIDATE)
  getMyApplications(@CurrentUser('id') userId: string) {
    return this.gigsService.getMyApplications(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gigsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.OPERATIONS)
  update(@Param('id') id: string, @Body() updateGigDto: UpdateGigDto) {
    return this.gigsService.update(id, updateGigDto);
  }

  @Post(':id/apply')
  @Roles(Role.CANDIDATE)
  apply(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.gigsService.apply(userId, id);
  }
}
