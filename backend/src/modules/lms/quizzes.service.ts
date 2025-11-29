import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateQuizDto, SubmitQuizDto } from './dto/lms.dto';
import { QuestionType } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: string, createQuizDto: CreateQuizDto) {
    return this.prisma.quiz.create({
      data: {
        ...createQuizDto,
        courseId,
        questions: {
          create: createQuizDto.questions.map((q) => ({
            ...q,
            type: q.type as QuestionType,
          })),
        },
      },
    });
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            type: true,
            question: true,
            options: true,
            points: true,
            // Exclude correctAnswer and explanation
          },
        },
      },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async submit(candidateId: string, quizId: string, submitDto: SubmitQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    let score = 0;
    const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const answersRecord: any[] = [];

    for (const answer of submitDto.answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.answer;
        if (isCorrect) {
          score += question.points;
        }
        answersRecord.push({
          questionId: question.id,
          answer: answer.answer,
          correct: isCorrect,
        });
      }
    }

    const passed = score >= (quiz.passingScore || 0);

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId,
        candidateId,
        score,
        maxScore,
        passed,
        answers: answersRecord,
        startedAt: new Date(), // Should ideally be passed from frontend
        completedAt: new Date(),
      },
    });

    return attempt;
  }
}
