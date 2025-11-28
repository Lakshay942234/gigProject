import { IsString, IsBoolean, IsOptional, IsInt, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    processType?: string;

    @IsBoolean()
    @IsOptional()
    isMandatory?: boolean;

    @IsInt()
    @IsOptional()
    duration?: number;

    @IsString()
    @IsOptional()
    contentUrl?: string;
}

export class CreateQuizQuestionDto {
    @IsString()
    type: string; // MULTIPLE_CHOICE, etc.

    @IsString()
    question: string;

    @IsArray()
    options: any[];

    @IsString()
    correctAnswer: string;

    @IsString()
    @IsOptional()
    explanation?: string;

    @IsInt()
    @IsOptional()
    points?: number;
}

export class CreateQuizDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    passingScore?: number;

    @IsInt()
    @IsOptional()
    timeLimit?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuizQuestionDto)
    questions: CreateQuizQuestionDto[];
}

export class SubmitQuizDto {
    @IsArray()
    answers: { questionId: string; answer: string }[];
}
