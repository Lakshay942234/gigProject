import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StartSessionDto, EndSessionDto, CreateChatSessionDto, UpdateChatSessionDto } from './dto/work.dto';
import { SessionStatus, ChatStatus, GigStatus } from '@prisma/client';
import { CandidatesService } from '../candidates/candidates.service';
import { GigsService } from '../gigs/gigs.service';

@Injectable()
export class WorkService {
    constructor(
        private prisma: PrismaService,
        private candidatesService: CandidatesService,
        private gigsService: GigsService,
    ) { }

    async startSession(userId: string, startSessionDto: StartSessionDto) {
        const candidate = await this.candidatesService.findByUserId(userId);
        if (!candidate) throw new NotFoundException('Candidate profile not found');

        const gig = await this.gigsService.findOne(startSessionDto.gigId);
        if (gig.status !== GigStatus.IN_PROGRESS && gig.status !== GigStatus.OPEN) {
            // Allow OPEN for testing, but ideally should be IN_PROGRESS
        }

        // Check for active session
        const activeSession = await this.prisma.workSession.findFirst({
            where: {
                candidateId: candidate.id,
                status: SessionStatus.ACTIVE,
            },
        });

        if (activeSession) {
            throw new BadRequestException('You already have an active work session');
        }

        return this.prisma.workSession.create({
            data: {
                gigId: startSessionDto.gigId,
                candidateId: candidate.id,
                status: SessionStatus.ACTIVE,
                startTime: new Date(),
            },
        });
    }

    async endSession(userId: string, sessionId: string, endSessionDto: EndSessionDto) {
        const session = await this.prisma.workSession.findUnique({
            where: { id: sessionId },
        });

        if (!session) throw new NotFoundException('Session not found');
        if (session.status !== SessionStatus.ACTIVE && session.status !== SessionStatus.PAUSED) {
            throw new BadRequestException('Session is already ended');
        }

        return this.prisma.workSession.update({
            where: { id: sessionId },
            data: {
                status: SessionStatus.COMPLETED,
                endTime: new Date(),
                ...endSessionDto,
            },
        });
    }

    async createChatSession(createChatDto: CreateChatSessionDto) {
        return this.prisma.chatSession.create({
            data: {
                ...createChatDto,
                status: ChatStatus.ACTIVE,
                startTime: new Date(),
                transcript: [],
            },
        });
    }

    async updateChatSession(id: string, updateChatDto: UpdateChatSessionDto) {
        return this.prisma.chatSession.update({
            where: { id },
            data: {
                ...updateChatDto,
                endTime: updateChatDto.status !== ChatStatus.ACTIVE ? new Date() : undefined,
            },
        });
    }

    async getActiveSession(userId: string) {
        const candidate = await this.candidatesService.findByUserId(userId);
        if (!candidate) throw new NotFoundException('Candidate not found');

        return this.prisma.workSession.findFirst({
            where: {
                candidateId: candidate.id,
                status: SessionStatus.ACTIVE,
            },
            include: {
                gig: true,
            },
        });
    }
}
