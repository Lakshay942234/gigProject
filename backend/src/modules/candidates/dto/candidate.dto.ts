import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
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

export class UpdateCandidateDto extends CreateCandidateDto {
    @IsOptional()
    @IsEnum(OnboardingStage)
    onboardingStage?: OnboardingStage;
}
