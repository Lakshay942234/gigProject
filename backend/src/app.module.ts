import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { VersantModule } from './modules/versant/versant.module';
import { LmsModule } from './modules/lms/lms.module';
import { GigsModule } from './modules/gigs/gigs.module';
import { WorkModule } from './modules/work/work.module';
import { QaModule } from './modules/qa/qa.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

    // Feature modules
    UsersModule,
    AuthModule,
    CandidatesModule,
    DocumentsModule,
    VersantModule,
    LmsModule,
    GigsModule,
    WorkModule,
    QaModule,
    PaymentsModule,
    PaymentsModule,
    AnalyticsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
