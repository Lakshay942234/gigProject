import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { VersantService } from './versant.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { CandidatesService } from '../candidates/candidates.service';

@Controller('versant')
export class VersantController {
    constructor(
        private readonly versantService: VersantService,
        private readonly candidatesService: CandidatesService,
    ) { }

    @Post('start')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE)
    async startTest(@CurrentUser('id') userId: string) {
        const candidate = await this.candidatesService.findByUserId(userId);
        if (!candidate) {
            throw new Error('Candidate profile not found');
        }
        return this.versantService.createTestSession(candidate.id);
    }

    @Post('webhook')
    async handleWebhook(@Body() payload: any) {
        // In production, verify webhook signature
        return this.versantService.processWebhook(payload);
    }
}
