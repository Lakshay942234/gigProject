import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RequestPayoutDto, UpdatePayoutStatusDto } from './dto/payments.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, PayoutStatus } from '@prisma/client';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Get('wallet')
    @Roles(Role.CANDIDATE)
    getMyWallet(@CurrentUser('id') userId: string) {
        return this.paymentsService.getWallet(userId);
    }

    @Post('payout/request')
    @Roles(Role.CANDIDATE)
    requestPayout(@CurrentUser('id') userId: string, @Body() requestPayoutDto: RequestPayoutDto) {
        return this.paymentsService.requestPayout(userId, requestPayoutDto);
    }

    @Get('payouts')
    @Roles(Role.ADMIN, Role.OPERATIONS)
    getAllPayouts(@Query('status') status?: PayoutStatus) {
        return this.paymentsService.getAllPayouts(status);
    }

    @Patch('payout/:id')
    @Roles(Role.ADMIN, Role.OPERATIONS)
    updatePayoutStatus(@Param('id') id: string, @Body() updateDto: UpdatePayoutStatusDto) {
        return this.paymentsService.updatePayoutStatus(id, updateDto);
    }
}
