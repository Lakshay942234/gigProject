import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCourseDto } from './dto/lms.dto';
import { CourseProgressStatus, OnboardingStage } from '@prisma/client';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async create(createCourseDto: CreateCourseDto) {
        return this.prisma.course.create({
            data: createCourseDto,
        });
    }

    async findAll(processType?: string) {
        return this.prisma.course.findMany({
            where: {
                isActive: true,
                ...(processType && { processType }),
            },
            orderBy: { order: 'asc' },
            include: {
                quizzes: {
                    select: { id: true, title: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                quizzes: true,
            },
        });
        if (!course) throw new NotFoundException('Course not found');
        return course;
    }

    async getProgress(candidateId: string) {
        return this.prisma.courseProgress.findMany({
            where: { candidateId },
            include: { course: true },
        });
    }

    async startCourse(candidateId: string, courseId: string) {
        return this.prisma.courseProgress.upsert({
            where: {
                candidateId_courseId: { candidateId, courseId },
            },
            update: {
                status: CourseProgressStatus.IN_PROGRESS,
                updatedAt: new Date(),
            },
            create: {
                candidateId,
                courseId,
                status: CourseProgressStatus.IN_PROGRESS,
                startedAt: new Date(),
            },
        });
    }

    async completeCourse(candidateId: string, courseId: string) {
        const progress = await this.prisma.courseProgress.update({
            where: {
                candidateId_courseId: { candidateId, courseId },
            },
            data: {
                status: CourseProgressStatus.COMPLETED,
                progress: 100,
                completedAt: new Date(),
            },
        });

        await this.checkQualification(candidateId);
        return progress;
    }

    private async checkQualification(candidateId: string) {
        // Check if all mandatory courses are completed
        // Simplified logic: if no incomplete mandatory courses exist
        const incompleteMandatory = await this.prisma.course.count({
            where: {
                isMandatory: true,
                isActive: true,
                progress: {
                    none: {
                        candidateId,
                        status: CourseProgressStatus.COMPLETED,
                    },
                },
            },
        });

        if (incompleteMandatory === 0) {
            // Check if Versant is passed
            const candidate = await this.prisma.candidate.findUnique({ where: { id: candidateId } });
            if (candidate?.onboardingStage === OnboardingStage.VERSANT_PASSED ||
                candidate?.onboardingStage === OnboardingStage.LMS_IN_PROGRESS) {

                await this.prisma.candidate.update({
                    where: { id: candidateId },
                    data: {
                        onboardingStage: OnboardingStage.QUALIFIED,
                        qualifiedToWork: true,
                        qualifiedAt: new Date(),
                    },
                });
            }
        }
    }
}
