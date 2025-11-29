import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN, Role.OPERATIONS)
  getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }

  @Post('snapshot')
  @Roles(Role.ADMIN) // Usually triggered by cron, but exposed for manual trigger
  createSnapshot() {
    return this.analyticsService.createDailySnapshot();
  }
}
