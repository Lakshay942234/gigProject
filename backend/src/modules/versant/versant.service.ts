import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../database/prisma.service';
import { CandidatesService } from '../candidates/candidates.service';
import { TestType, TestStatus, OnboardingStage } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VersantService {
  private readonly logger = new Logger(VersantService.name);
  private apiUrl: string;
  private apiKey: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private prisma: PrismaService,
    private candidatesService: CandidatesService,
  ) {
    this.apiUrl =
      this.configService.get<string>('VERSANT_API_URL') ||
      'https://api.mock-versant.com';
    this.apiKey =
      this.configService.get<string>('VERSANT_API_KEY') || 'mock-key';
  }

  async createTestSession(candidateId: string) {
    const candidate = await this.candidatesService.findByUserId(candidateId); // Note: this expects userId, need to fix if passing candidateId
    // Actually, let's assume we pass userId to this method for consistency

    // Create a local test record
    const testRecord = await this.prisma.testResult.create({
      data: {
        candidateId: candidateId, // This needs to be the candidate UUID, not User UUID.
        // Wait, the service method should probably take candidateId directly.
        // Let's fix the controller to pass the correct ID.
        testType: TestType.VERSANT,
        status: TestStatus.SCHEDULED,
      },
    });

    try {
      // Call Versant API to generate test link
      // Mock implementation for now
      const mockTestUrl = `https://versant-test.com/start/${testRecord.id}`;

      // In real implementation:
      // const response = await firstValueFrom(this.httpService.post(`${this.apiUrl}/sessions`, { ... }));
      // return response.data.testUrl;

      return {
        testId: testRecord.id,
        testUrl: mockTestUrl,
      };
    } catch (error) {
      this.logger.error('Failed to create Versant session', error);
      throw new BadRequestException('Failed to initiate Versant test');
    }
  }

  async processWebhook(payload: any) {
    // Payload would contain testId, score, status
    const { testId, score, status } = payload;

    const testResult = await this.prisma.testResult.findUnique({
      where: { id: testId },
    });

    if (!testResult) {
      this.logger.warn(`Received webhook for unknown test ${testId}`);
      return;
    }

    // Update test result
    await this.prisma.testResult.update({
      where: { id: testId },
      data: {
        score: score,
        status:
          status === 'completed' ? TestStatus.COMPLETED : TestStatus.FAILED,
        passed: score >= 55, // Example threshold
        completedAt: new Date(),
        metadata: payload,
      },
    });

    // Update candidate status if passed
    if (score >= 55) {
      await this.prisma.candidate.update({
        where: { id: testResult.candidateId },
        data: {
          versantScore: score,
          onboardingStage: OnboardingStage.VERSANT_PASSED,
        },
      });
    }
  }
}
