import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewStatus } from '@prisma/client';

export class ScorecardItemDto {
  @IsString()
  criteriaName: string;

  @IsNumber()
  score: number;

  @IsNumber()
  maxScore: number;

  @IsString()
  @IsOptional()
  comments?: string;
}

export class CreateReviewDto {
  @IsString()
  workSessionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScorecardItemDto)
  scorecard: ScorecardItemDto[];

  @IsString()
  @IsOptional()
  feedback?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  errorTags?: string[];

  @IsString()
  @IsOptional()
  positives?: string;

  @IsString()
  @IsOptional()
  areasOfImprovement?: string;

  @IsBoolean()
  @IsOptional()
  requiresRetraining?: boolean;
}

export class UpdateReviewDto {
  @IsEnum(ReviewStatus)
  @IsOptional()
  status?: ReviewStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScorecardItemDto)
  @IsOptional()
  scorecard?: ScorecardItemDto[];

  @IsString()
  @IsOptional()
  feedback?: string;
}
