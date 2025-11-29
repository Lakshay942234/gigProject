import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCandidateDto, UpdateCandidateDto } from './dto/candidate.dto';
import { Candidate, OnboardingStage } from '@prisma/client';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createCandidateDto: CreateCandidateDto,
  ): Promise<Candidate> {
    return this.prisma.candidate.create({
      data: {
        userId,
        skills: createCandidateDto.skills,
        languages: createCandidateDto.languages ?? [],
        availability: createCandidateDto.availability ?? {},
        address: createCandidateDto.address
          ? (createCandidateDto.address as any)
          : undefined,
        onboardingStage: OnboardingStage.PROFILE_PENDING,
      },
    });
  }

  async findByUserId(userId: string): Promise<Candidate | null> {
    return this.prisma.candidate.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        documents: true,
      },
    });
  }

  async update(
    userId: string,
    updateCandidateDto: UpdateCandidateDto,
  ): Promise<Candidate> {
    const candidate = await this.findByUserId(userId);
    if (!candidate) {
      throw new NotFoundException('Candidate profile not found');
    }

    return this.prisma.candidate.update({
      where: { userId },
      data: {
        ...updateCandidateDto,
        address: updateCandidateDto.address
          ? (updateCandidateDto.address as any)
          : undefined,
      },
    });
  }

  async updateStage(
    userId: string,
    stage: OnboardingStage,
  ): Promise<Candidate> {
    return this.prisma.candidate.update({
      where: { userId },
      data: { onboardingStage: stage },
    });
  }

  async completeQuiz(userId: string): Promise<Candidate> {
    return this.prisma.candidate.upsert({
      where: { userId },
      update: {
        qualifiedToWork: true,
        qualifiedAt: new Date(),
      },
      create: {
        userId,
        qualifiedToWork: true,
        qualifiedAt: new Date(),
        skills: [],
        languages: [],
        availability: {},
      },
    });
  }
}
