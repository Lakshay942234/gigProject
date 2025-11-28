import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateGigDto, UpdateGigDto } from './dto/gig.dto';
import { GigStatus, ApplicationStatus, OnboardingStage } from '@prisma/client';
import { CandidatesService } from '../candidates/candidates.service';

@Injectable()
export class GigsService {
    constructor(
        private prisma: PrismaService,
        private candidatesService: CandidatesService,
    ) { }

    async create(userId: string, createGigDto: CreateGigDto) {
        const { startDate, endDate, ...gigData } = createGigDto;

        return this.prisma.gig.create({
            data: {
                ...gigData,
                status: GigStatus.DRAFT,
                createdBy: userId,
                requiredSkills: createGigDto.requiredSkills,
                requiredCourses: createGigDto.requiredCourses ?? [],
                schedule: {
                    startDate,
                    endDate,
                    shifts: [] // Initialize with empty shifts
                },
                maxAgents: createGigDto.maxAgents ?? 10,
            },
        });
    }

    async findAll(status?: GigStatus) {
        return this.prisma.gig.findMany({
            where: status ? { status } : {},
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const gig = await this.prisma.gig.findUnique({
            where: { id },
            include: {
                applications: true,
            },
        });
        if (!gig) throw new NotFoundException('Gig not found');
        return gig;
    }

    async update(id: string, updateGigDto: UpdateGigDto) {
        return this.prisma.gig.update({
            where: { id },
            data: {
                ...updateGigDto,
                requiredSkills: updateGigDto.requiredSkills,
                requiredCourses: updateGigDto.requiredCourses,
            },
        });
    }

    async apply(userId: string, gigId: string) {
        const candidate = await this.candidatesService.findByUserId(userId);
        if (!candidate) throw new NotFoundException('Candidate profile not found');

        // Check qualification
        if (!candidate.qualifiedToWork) {
            throw new BadRequestException('Candidate is not qualified to apply for gigs');
        }

        const gig = await this.prisma.gig.findUnique({ where: { id: gigId } });
        if (!gig) throw new NotFoundException('Gig not found');
        if (gig.status !== GigStatus.OPEN) {
            throw new BadRequestException('Gig is not open for applications');
        }

        // Check existing application
        const existingApplication = await this.prisma.gigApplication.findUnique({
            where: {
                gigId_candidateId: {
                    gigId,
                    candidateId: candidate.id,
                },
            },
        });

        if (existingApplication) {
            throw new BadRequestException('Already applied to this gig');
        }

        return this.prisma.gigApplication.create({
            data: {
                gigId,
                candidateId: candidate.id,
                status: ApplicationStatus.APPLIED,
            },
        });
    }

    async getMyApplications(userId: string) {
        const candidate = await this.candidatesService.findByUserId(userId);
        if (!candidate) throw new NotFoundException('Candidate profile not found');

        return this.prisma.gigApplication.findMany({
            where: { candidateId: candidate.id },
            include: { gig: true },
        });
    }
}
