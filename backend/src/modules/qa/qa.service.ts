import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ScorecardItemDto,
} from './dto/qa.dto';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class QaService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: string, createReviewDto: CreateReviewDto) {
    // Verify work session exists
    const session = await this.prisma.workSession.findUnique({
      where: { id: createReviewDto.workSessionId },
    });
    if (!session) throw new NotFoundException('Work session not found');

    // Calculate scores
    const { totalScore, maxScore } = this.calculateScores(
      createReviewDto.scorecard,
    );

    return this.prisma.qAReview.create({
      data: {
        workSessionId: createReviewDto.workSessionId,
        reviewerId,
        status: ReviewStatus.COMPLETED,
        scorecard: createReviewDto.scorecard as any,
        totalScore,
        maxScore,
        feedback: createReviewDto.feedback,
        errorTags: createReviewDto.errorTags ?? [],
        positives: createReviewDto.positives,
        areasOfImprovement: createReviewDto.areasOfImprovement,
        requiresRetraining: createReviewDto.requiresRetraining ?? false,
        reviewedAt: new Date(),
      },
    });
  }

  async findAll(reviewerId?: string) {
    return this.prisma.qAReview.findMany({
      where: reviewerId ? { reviewerId } : {},
      include: {
        workSession: {
          include: {
            candidate: {
              select: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
            gig: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.qAReview.findUnique({
      where: { id },
      include: {
        workSession: true,
        reviewer: {
          select: { firstName: true, lastName: true },
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const data: any = { ...updateReviewDto };

    if (updateReviewDto.scorecard) {
      const { totalScore, maxScore } = this.calculateScores(
        updateReviewDto.scorecard,
      );
      data.totalScore = totalScore;
      data.maxScore = maxScore;
      data.scorecard = updateReviewDto.scorecard as any;
    }

    return this.prisma.qAReview.update({
      where: { id },
      data,
    });
  }

  private calculateScores(scorecard: ScorecardItemDto[]) {
    const totalScore = scorecard.reduce((sum, item) => sum + item.score, 0);
    const maxScore = scorecard.reduce((sum, item) => sum + item.maxScore, 0);
    return { totalScore, maxScore };
  }
}
