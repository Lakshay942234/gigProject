import { IsString, IsEnum, IsOptional, IsInt, IsNumber, IsDateString, IsArray } from 'class-validator';
import { PayModel, GigStatus } from '@prisma/client';

export class CreateGigDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    processType: string;

    @IsEnum(PayModel)
    payModel: PayModel;

    @IsNumber()
    payRate: number;

    @IsString()
    currency: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsArray()
    @IsString({ each: true })
    requiredSkills: string[];

    @IsNumber()
    @IsOptional()
    minVersantScore?: number;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    requiredCourses?: string[];
}

export class UpdateGigDto extends CreateGigDto {
    @IsEnum(GigStatus)
    @IsOptional()
    status?: GigStatus;
}

export class CreateApplicationDto {
    @IsString()
    gigId: string;
}
