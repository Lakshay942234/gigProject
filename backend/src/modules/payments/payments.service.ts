import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTransactionDto, RequestPayoutDto, UpdatePayoutStatusDto } from './dto/payments.dto';
import { TransactionType, TransactionStatus, PayoutStatus } from '@prisma/client';
import { CandidatesService } from '../candidates/candidates.service';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        private candidatesService: CandidatesService,
    ) { }

    async getWallet(userId: string) {
        const candidate = await this.candidatesService.findByUserId(userId);
        if (!candidate) throw new NotFoundException('Candidate not found');

        let wallet = await this.prisma.wallet.findUnique({
            where: { candidateId: candidate.id },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (!wallet) {
            wallet = await this.prisma.wallet.create({
                data: { candidateId: candidate.id },
                include: { transactions: true },
            });
        }

        return wallet;
    }

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { candidateId: createTransactionDto.candidateId },
        });

        if (!wallet) throw new NotFoundException('Wallet not found');

        const balanceBefore = wallet.balance;
        let balanceAfter = balanceBefore;

        if (
            createTransactionDto.type === TransactionType.EARNING ||
            createTransactionDto.type === TransactionType.BONUS ||
            createTransactionDto.type === TransactionType.REFUND
        ) {
            balanceAfter += createTransactionDto.amount;
        } else {
            if (balanceBefore < createTransactionDto.amount) {
                throw new BadRequestException('Insufficient balance');
            }
            balanceAfter -= createTransactionDto.amount;
        }

        // Use transaction to ensure atomicity
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: createTransactionDto.type,
                    amount: createTransactionDto.amount,
                    status: TransactionStatus.COMPLETED,
                    description: createTransactionDto.description,
                    metadata: createTransactionDto.metadata ?? {},
                    balanceBefore,
                    balanceAfter,
                    processedAt: new Date(),
                },
            });

            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: balanceAfter,
                    totalEarned:
                        createTransactionDto.type === TransactionType.EARNING
                            ? { increment: createTransactionDto.amount }
                            : undefined,
                },
            });

            return transaction;
        });
    }

    async requestPayout(userId: string, requestPayoutDto: RequestPayoutDto) {
        const wallet = await this.getWallet(userId);

        if (wallet.balance < requestPayoutDto.amount) {
            throw new BadRequestException('Insufficient balance for payout');
        }

        return this.prisma.$transaction(async (tx) => {
            // Create payout record
            const payout = await tx.payout.create({
                data: {
                    walletId: wallet.id,
                    amount: requestPayoutDto.amount,
                    status: PayoutStatus.PENDING,
                    paymentMethod: requestPayoutDto.paymentMethod,
                    paymentDetails: requestPayoutDto.paymentDetails,
                },
            });

            // Deduct from wallet immediately (hold funds)
            // We create a "PAYOUT" transaction
            await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: TransactionType.PAYOUT,
                    amount: requestPayoutDto.amount,
                    status: TransactionStatus.PENDING,
                    description: `Payout request ${payout.id}`,
                    balanceBefore: wallet.balance,
                    balanceAfter: wallet.balance - requestPayoutDto.amount,
                },
            });

            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { decrement: requestPayoutDto.amount },
                    totalWithdrawn: { increment: requestPayoutDto.amount },
                },
            });

            return payout;
        });
    }

    async getAllPayouts(status?: PayoutStatus) {
        return this.prisma.payout.findMany({
            where: status ? { status } : {},
            include: { wallet: { include: { candidate: { include: { user: true } } } } },
            orderBy: { requestedAt: 'desc' },
        });
    }

    async updatePayoutStatus(id: string, updateDto: UpdatePayoutStatusDto) {
        const payout = await this.prisma.payout.findUnique({ where: { id } });
        if (!payout) throw new NotFoundException('Payout not found');

        return this.prisma.payout.update({
            where: { id },
            data: {
                status: updateDto.status,
                failureReason: updateDto.failureReason,
                paymentGatewayId: updateDto.paymentGatewayId,
                processedAt: updateDto.status !== PayoutStatus.PENDING ? new Date() : undefined,
                completedAt: updateDto.status === PayoutStatus.COMPLETED ? new Date() : undefined,
            },
        });
    }
}
