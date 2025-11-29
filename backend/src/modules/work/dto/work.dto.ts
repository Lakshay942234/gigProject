import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionStatus, ChatStatus } from '@prisma/client';

export class StartSessionDto {
  @IsString()
  gigId: string;
}

export class EndSessionDto {
  @IsInt()
  activeMinutes: number;

  @IsInt()
  idleMinutes: number;

  @IsInt()
  chatCount: number;

  @IsInt()
  resolvedCount: number;
}

export class CreateChatSessionDto {
  @IsString()
  workSessionId: string;

  @IsString()
  @IsOptional()
  externalChatId?: string;

  @IsString()
  @IsOptional()
  customerName?: string;
}

export class UpdateChatSessionDto {
  @IsEnum(ChatStatus)
  status: ChatStatus;

  @IsInt()
  @IsOptional()
  handleTime?: number;

  @IsOptional()
  transcript?: any;

  @IsString()
  @IsOptional()
  sentiment?: string;

  @IsNumber()
  @IsOptional()
  csatScore?: number;
}
