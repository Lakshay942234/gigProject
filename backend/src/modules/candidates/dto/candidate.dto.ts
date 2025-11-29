import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OnboardingStage } from '@prisma/client';

export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip: string;

  @IsString()
  country: string;
}

export class CreateCandidateDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  languages: any[]; // Define specific structure if needed

  @IsOptional()
  availability?: any;
}

export class UpdateCandidateDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  hourlyRate?: number;

  @IsOptional()
  experienceYears?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  languages?: any[];

  @IsOptional()
  availability?: any;

  @IsOptional()
  @IsEnum(OnboardingStage)
  onboardingStage?: OnboardingStage;
}
