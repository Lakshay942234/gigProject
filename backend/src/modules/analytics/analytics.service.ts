import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SessionStatus, TransactionType } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalCandidates, activeAgents, todaysSessions, todaysEarnings] =
      await Promise.all([
        this.prisma.candidate.count(),
        this.prisma.candidate.count({ where: { qualifiedToWork: true } }),
        this.prisma.workSession.count({
          where: {
            startTime: { gte: today },
          },
        }),
        this.prisma.transaction.aggregate({
          where: {
            type: TransactionType.EARNING,
            createdAt: { gte: today },
          },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalCandidates,
      activeAgents,
      todaysSessions,
      todaysEarnings: todaysEarnings._sum.amount || 0,
    };
  }

  async createDailySnapshot() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Aggregate metrics
    const totalCandidates = await this.prisma.candidate.count();
    const qualifiedAgents = await this.prisma.candidate.count({
      where: { qualifiedToWork: true },
    });

    // Active agents (had a session today)
    const activeAgents = await this.prisma.workSession
      .groupBy({
        by: ['candidateId'],
        where: { startTime: { gte: today } },
      })
      .then((res) => res.length);

    const totalSessions = await this.prisma.workSession.count({
      where: { startTime: { gte: today } },
    });
    const totalChats = await this.prisma.chatSession.count({
      where: { startTime: { gte: today } },
    });

    const avgHandleTimeAgg = await this.prisma.chatSession.aggregate({
      where: { startTime: { gte: today } },
      _avg: { handleTime: true },
    });

    const avgCsatAgg = await this.prisma.chatSession.aggregate({
      where: { startTime: { gte: today } },
      _avg: { csatScore: true },
    });

    const avgQaScoreAgg = await this.prisma.qAReview.aggregate({
      where: { createdAt: { gte: today } },
      _avg: { totalScore: true }, // Note: This should ideally be normalized
    });

    const financialAgg = await this.prisma.transaction.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { amount: true },
    });

    const payoutsAgg = await this.prisma.payout.aggregate({
      where: { requestedAt: { gte: today } },
      _sum: { amount: true },
    });

    return this.prisma.analyticsSnapshot.create({
      data: {
        snapshotDate: today,
        totalCandidates,
        qualifiedAgents,
        activeAgents,
        totalSessions,
        totalChats,
        avgHandleTime: avgHandleTimeAgg._avg.handleTime || 0,
        avgCsat: avgCsatAgg._avg.csatScore || 0,
        avgQaScore: avgQaScoreAgg._avg.totalScore || 0,
        complianceRate: 0, // Placeholder
        totalEarnings: 0, // Placeholder, needs logic to distinguish earnings vs payouts in transaction agg if mixed
        totalPayouts: payoutsAgg._sum.amount || 0,
      },
    });
  }
}
