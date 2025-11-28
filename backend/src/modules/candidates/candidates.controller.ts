import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto, UpdateCandidateDto } from './dto/candidate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('candidates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CandidatesController {
    constructor(private readonly candidatesService: CandidatesService) { }

    @Post()
    @Roles(Role.CANDIDATE)
    create(@CurrentUser('id') userId: string, @Body() createCandidateDto: CreateCandidateDto) {
        return this.candidatesService.create(userId, createCandidateDto);
    }

    @Get('me')
    @Roles(Role.CANDIDATE)
    getProfile(@CurrentUser('id') userId: string) {
        return this.candidatesService.findByUserId(userId);
    }

    @Patch('me')
    @Roles(Role.CANDIDATE)
    update(@CurrentUser('id') userId: string, @Body() updateCandidateDto: UpdateCandidateDto) {
        return this.candidatesService.update(userId, updateCandidateDto);
    }
}
