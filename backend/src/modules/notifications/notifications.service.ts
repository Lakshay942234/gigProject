import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import * as webpush from 'web-push';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PushSubscription as PrismaPushSubscription } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:example@yourdomain.org',
      process.env.VAPID_PUBLIC_KEY || '',
      process.env.VAPID_PRIVATE_KEY || '',
    );
  }

  async subscribe(
    subscription: CreateSubscriptionDto,
    userId: string,
  ): Promise<any> {
    this.logger.log(
      `Subscribing user ${userId} with endpoint ${subscription.endpoint}`,
    );
    // Check if subscription already exists
    const existing = await this.prisma.pushSubscription.findFirst({
      where: {
        endpoint: subscription.endpoint,
        userId: userId,
      },
    });

    if (existing) {
      this.logger.log(`Subscription already exists for user ${userId}`);
      return existing;
    }

    const newSub = await this.prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
    });
    this.logger.log(`Created new subscription for user ${userId}`);
    return newSub;
  }

  async sendNotification(subscription: any, payload: any) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
      this.logger.error('Error sending notification', error);
      if (error.statusCode === 410 || error.statusCode === 404) {
        // Subscription is no longer valid, delete it
        await this.prisma.pushSubscription.deleteMany({
          where: { endpoint: subscription.endpoint },
        });
      }
    }
  }

  async sendTestNotification(userId: string) {
    this.logger.log(
      `Scheduling test notification for user ${userId} in 5 seconds`,
    );
    setTimeout(async () => {
      try {
        const subscriptions: PrismaPushSubscription[] =
          await this.prisma.pushSubscription.findMany({
            where: { userId },
          });

        this.logger.log(
          `Found ${subscriptions.length} subscriptions for user ${userId}`,
        );

        for (const sub of subscriptions) {
          try {
            await this.sendNotification(
              { endpoint: sub.endpoint, keys: sub.keys as any },
              {
                title: 'You have a new gig!',
                body: 'Click to view',
                url: '/dashboard/gigs',
              },
            );
            this.logger.log(
              `Successfully sent notification to endpoint ${sub.endpoint}`,
            );
          } catch (err) {
            this.logger.error(
              `Failed to send to endpoint ${sub.endpoint}`,
              err,
            );
          }
        }
      } catch (error) {
        this.logger.error('Error in test notification timeout', error);
      }
    }, 5000);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkUpcomingGigs() {
    this.logger.log('Checking for upcoming gigs...');
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
    const thirtyOneMinutesFromNow = new Date(now.getTime() + 31 * 60000);

    // Find gigs that have shifts starting between 30 and 31 minutes from now
    // This is a simplified check. In a real scenario, we'd need to parse the schedule JSON more carefully
    // or store shifts as separate records.
    // For this implementation, we will fetch all active gigs and check their schedule in memory.
    // Optimization: Filter by status OPEN or IN_PROGRESS

    const gigs = await this.prisma.gig.findMany({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
      include: {
        applications: {
          where: { status: 'APPROVED' },
          include: {
            candidate: {
              include: { user: { include: { pushSubscriptions: true } } },
            },
          },
        },
      },
    });

    for (const gig of gigs) {
      const schedule = gig.schedule as any;
      if (!schedule || !schedule.shifts) continue;

      // Check if any shift starts in ~30 mins
      // Assuming schedule.shifts is array of { day, startTime, endTime } or specific dates
      // Let's assume specific dates for simplicity or recurring.
      // If recurring, we need to map 'day' to current date.

      // For this MVP, let's assume schedule has specific dates or we handle "Today"
      // Let's look for a simpler approach: Check if there's a WorkSession scheduled?
      // No, WorkSession is created when they start.

      // Let's assume the schedule JSON has a structure we can parse.
      // Example: { startDate: '2023-10-27', endDate: '2023-11-27', shifts: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }] }

      // We need to check if TODAY matches one of the shifts and if the time is 30 mins away.

      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"
      const currentTime = thirtyMinutesFromNow.toTimeString().slice(0, 5); // "HH:MM"

      // Check if any shift matches currentDay and startTime matches currentTime
      const matchingShift = schedule.shifts.find((shift: any) => {
        // Handle day matching (could be "Monday" or "Mon")
        const dayMatches = shift.day === currentDay;

        // Handle time matching.
        // We are checking if the shift starts in 30 mins.
        // So if shift.startTime is "10:00", and now is "09:30", thirtyMinutesFromNow is "10:00".
        // We need to be careful with seconds, hence the range check in the query logic (30-31 mins)
        // But here we are iterating.

        // Let's parse shift.startTime to compare properly
        if (!dayMatches) return false;

        const [sh, sm] = shift.startTime.split(':').map(Number);
        const shiftDate = new Date(now);
        shiftDate.setHours(sh, sm, 0, 0);

        return (
          shiftDate >= thirtyMinutesFromNow &&
          shiftDate < thirtyOneMinutesFromNow
        );
      });

      if (matchingShift) {
        this.logger.log(`Found upcoming shift for gig ${gig.title}`);
        // Notify all approved candidates
        for (const app of gig.applications) {
          const user = app.candidate.user;
          if (user && user.pushSubscriptions) {
            for (const sub of user.pushSubscriptions) {
              await this.sendNotification(
                { endpoint: sub.endpoint, keys: sub.keys },
                {
                  title: 'Upcoming Gig Reminder',
                  body: `Your gig "${gig.title}" starts in 30 minutes!`,
                  url: `/dashboard/work/${gig.id}`, // Deep link to work page
                },
              );
            }
          }
        }
      }
    }
  }
}
