-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CANDIDATE', 'AGENT', 'QA', 'ADMIN', 'OPERATIONS', 'CLIENT_MANAGER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "OnboardingStage" AS ENUM ('REGISTERED', 'PROFILE_PENDING', 'DOCUMENTS_PENDING', 'VERSANT_PENDING', 'VERSANT_PASSED', 'LMS_IN_PROGRESS', 'QUALIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID_PROOF', 'PAN_CARD', 'AADHAAR', 'RESUME', 'CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('VERSANT', 'JOB_SPECIFIC', 'QUIZ', 'ASSESSMENT');

-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SCENARIO');

-- CreateEnum
CREATE TYPE "CourseProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "GigStatus" AS ENUM ('DRAFT', 'OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayModel" AS ENUM ('HOURLY', 'PER_TASK', 'PER_CHAT', 'FIXED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'BRIEFING_VIEWED', 'TEST_PASSED', 'APPROVED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'FORCIBLY_ENDED');

-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'ESCALATED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EARNING', 'BONUS', 'DEDUCTION', 'PAYOUT', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'IN_APP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "keycloakId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "onboardingStage" "OnboardingStage" NOT NULL DEFAULT 'REGISTERED',
    "dateOfBirth" TIMESTAMP(3),
    "address" JSONB,
    "skills" JSONB NOT NULL,
    "languages" JSONB NOT NULL,
    "availability" JSONB NOT NULL,
    "versantScore" DOUBLE PRECISION,
    "qualifiedToWork" BOOLEAN NOT NULL DEFAULT false,
    "qualifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "notes" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "testType" "TestType" NOT NULL,
    "testId" TEXT,
    "score" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "status" "TestStatus" NOT NULL,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "processType" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER,
    "contentUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "passingScore" DOUBLE PRECISION NOT NULL DEFAULT 70.0,
    "timeLimit" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_progress" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" "CourseProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastPosition" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answers" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gigs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "processType" TEXT NOT NULL,
    "payRate" DOUBLE PRECISION NOT NULL,
    "payModel" "PayModel" NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "requiredSkills" JSONB NOT NULL,
    "minVersantScore" DOUBLE PRECISION,
    "requiredCourses" JSONB,
    "maxAgents" INTEGER NOT NULL,
    "schedule" JSONB NOT NULL,
    "knowmaxBriefingId" TEXT,
    "sopUrl" TEXT,
    "status" "GigStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "gigs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gig_applications" (
    "id" TEXT NOT NULL,
    "gigId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "briefingViewedAt" TIMESTAMP(3),
    "testScore" DOUBLE PRECISION,
    "testPassed" BOOLEAN,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gig_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_sessions" (
    "id" TEXT NOT NULL,
    "gigId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "activeMinutes" INTEGER NOT NULL DEFAULT 0,
    "idleMinutes" INTEGER NOT NULL DEFAULT 0,
    "chatCount" INTEGER NOT NULL DEFAULT 0,
    "resolvedCount" INTEGER NOT NULL DEFAULT 0,
    "avgHandleTime" DOUBLE PRECISION,
    "dtTraversal" JSONB,
    "wardenFlags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "workSessionId" TEXT NOT NULL,
    "externalChatId" TEXT,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "status" "ChatStatus" NOT NULL,
    "category" TEXT,
    "tags" JSONB,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "handleTime" INTEGER,
    "transcript" JSONB NOT NULL,
    "sentiment" TEXT,
    "csatScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qa_reviews" (
    "id" TEXT NOT NULL,
    "workSessionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "scorecard" JSONB NOT NULL,
    "totalScore" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION,
    "feedback" TEXT,
    "errorTags" JSONB,
    "positives" TEXT,
    "areasOfImprovement" TEXT,
    "requiresRetraining" BOOLEAN NOT NULL DEFAULT false,
    "retrainingCourses" JSONB,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qa_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "balanceBefore" DOUBLE PRECISION NOT NULL,
    "balanceAfter" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL,
    "paymentDetails" JSONB NOT NULL,
    "paymentGatewayId" TEXT,
    "failureReason" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_snapshots" (
    "id" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "totalCandidates" INTEGER NOT NULL,
    "qualifiedAgents" INTEGER NOT NULL,
    "activeAgents" INTEGER NOT NULL,
    "totalSessions" INTEGER NOT NULL,
    "totalChats" INTEGER NOT NULL,
    "avgHandleTime" DOUBLE PRECISION,
    "avgCsat" DOUBLE PRECISION,
    "avgQaScore" DOUBLE PRECISION,
    "complianceRate" DOUBLE PRECISION,
    "totalEarnings" DOUBLE PRECISION NOT NULL,
    "totalPayouts" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_keycloakId_key" ON "users"("keycloakId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_keycloakId_idx" ON "users"("keycloakId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_userId_key" ON "candidates"("userId");

-- CreateIndex
CREATE INDEX "candidates_userId_idx" ON "candidates"("userId");

-- CreateIndex
CREATE INDEX "candidates_onboardingStage_idx" ON "candidates"("onboardingStage");

-- CreateIndex
CREATE INDEX "candidates_qualifiedToWork_idx" ON "candidates"("qualifiedToWork");

-- CreateIndex
CREATE INDEX "documents_candidateId_idx" ON "documents"("candidateId");

-- CreateIndex
CREATE INDEX "documents_status_idx" ON "documents"("status");

-- CreateIndex
CREATE INDEX "test_results_candidateId_idx" ON "test_results"("candidateId");

-- CreateIndex
CREATE INDEX "test_results_testType_idx" ON "test_results"("testType");

-- CreateIndex
CREATE INDEX "courses_processType_idx" ON "courses"("processType");

-- CreateIndex
CREATE INDEX "courses_isMandatory_idx" ON "courses"("isMandatory");

-- CreateIndex
CREATE INDEX "quizzes_courseId_idx" ON "quizzes"("courseId");

-- CreateIndex
CREATE INDEX "quiz_questions_quizId_idx" ON "quiz_questions"("quizId");

-- CreateIndex
CREATE INDEX "course_progress_candidateId_idx" ON "course_progress"("candidateId");

-- CreateIndex
CREATE INDEX "course_progress_courseId_idx" ON "course_progress"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_progress_candidateId_courseId_key" ON "course_progress"("candidateId", "courseId");

-- CreateIndex
CREATE INDEX "quiz_attempts_quizId_idx" ON "quiz_attempts"("quizId");

-- CreateIndex
CREATE INDEX "quiz_attempts_candidateId_idx" ON "quiz_attempts"("candidateId");

-- CreateIndex
CREATE INDEX "gigs_status_idx" ON "gigs"("status");

-- CreateIndex
CREATE INDEX "gigs_processType_idx" ON "gigs"("processType");

-- CreateIndex
CREATE INDEX "gig_applications_gigId_idx" ON "gig_applications"("gigId");

-- CreateIndex
CREATE INDEX "gig_applications_candidateId_idx" ON "gig_applications"("candidateId");

-- CreateIndex
CREATE INDEX "gig_applications_status_idx" ON "gig_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "gig_applications_gigId_candidateId_key" ON "gig_applications"("gigId", "candidateId");

-- CreateIndex
CREATE INDEX "work_sessions_gigId_idx" ON "work_sessions"("gigId");

-- CreateIndex
CREATE INDEX "work_sessions_candidateId_idx" ON "work_sessions"("candidateId");

-- CreateIndex
CREATE INDEX "work_sessions_status_idx" ON "work_sessions"("status");

-- CreateIndex
CREATE INDEX "chat_sessions_workSessionId_idx" ON "chat_sessions"("workSessionId");

-- CreateIndex
CREATE INDEX "chat_sessions_status_idx" ON "chat_sessions"("status");

-- CreateIndex
CREATE INDEX "qa_reviews_workSessionId_idx" ON "qa_reviews"("workSessionId");

-- CreateIndex
CREATE INDEX "qa_reviews_reviewerId_idx" ON "qa_reviews"("reviewerId");

-- CreateIndex
CREATE INDEX "qa_reviews_status_idx" ON "qa_reviews"("status");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_candidateId_key" ON "wallets"("candidateId");

-- CreateIndex
CREATE INDEX "wallets_candidateId_idx" ON "wallets"("candidateId");

-- CreateIndex
CREATE INDEX "transactions_walletId_idx" ON "transactions"("walletId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "payouts_walletId_idx" ON "payouts"("walletId");

-- CreateIndex
CREATE INDEX "payouts_status_idx" ON "payouts"("status");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "analytics_snapshots_snapshotDate_idx" ON "analytics_snapshots"("snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_snapshots_snapshotDate_key" ON "analytics_snapshots"("snapshotDate");

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gig_applications" ADD CONSTRAINT "gig_applications_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "gigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gig_applications" ADD CONSTRAINT "gig_applications_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "gigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_workSessionId_fkey" FOREIGN KEY ("workSessionId") REFERENCES "work_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qa_reviews" ADD CONSTRAINT "qa_reviews_workSessionId_fkey" FOREIGN KEY ("workSessionId") REFERENCES "work_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qa_reviews" ADD CONSTRAINT "qa_reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
