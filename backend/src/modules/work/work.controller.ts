import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { WorkService } from './work.service';
import {
  StartSessionDto,
  EndSessionDto,
  CreateChatSessionDto,
  UpdateChatSessionDto,
} from './dto/work.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('work')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post('session/start')
  @Roles(Role.CANDIDATE)
  startSession(
    @CurrentUser('id') userId: string,
    @Body() startSessionDto: StartSessionDto,
  ) {
    return this.workService.startSession(userId, startSessionDto);
  }

  @Post('session/:id/end')
  @Roles(Role.CANDIDATE)
  endSession(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() endSessionDto: EndSessionDto,
  ) {
    return this.workService.endSession(userId, id, endSessionDto);
  }

  @Get('session/active')
  @Roles(Role.CANDIDATE)
  getActiveSession(@CurrentUser('id') userId: string) {
    return this.workService.getActiveSession(userId);
  }

  @Post('chat')
  @Roles(Role.CANDIDATE, Role.AGENT) // AGENT role might be used later
  createChatSession(@Body() createChatDto: CreateChatSessionDto) {
    return this.workService.createChatSession(createChatDto);
  }

  @Get('chat/:id')
  @Roles(Role.CANDIDATE, Role.AGENT)
  getChatSession(@Param('id') id: string) {
    return this.workService.getChatSession(id);
  }

  @Patch('chat/:id')
  @Roles(Role.CANDIDATE, Role.AGENT)
  updateChatSession(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatSessionDto,
  ) {
    return this.workService.updateChatSession(id, updateChatDto);
  }
}
