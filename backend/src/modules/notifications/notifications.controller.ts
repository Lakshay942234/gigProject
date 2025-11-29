import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return { publicKey: process.env.VAPID_PUBLIC_KEY };
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribe(
    @Body() subscription: CreateSubscriptionDto,
    @Req() req: RequestWithUser,
  ) {
    return this.notificationsService.subscribe(subscription, req.user.id);
  }

  @Post('test')
  @UseGuards(JwtAuthGuard)
  async testNotification(@Req() req: RequestWithUser) {
    await this.notificationsService.sendTestNotification(req.user.id);
    return { message: 'Test notification scheduled in 5 seconds' };
  }
}
