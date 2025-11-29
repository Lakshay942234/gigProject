import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';
import { TransactionType, PayoutStatus } from '@prisma/client';

export class CreateTransactionDto {
  @IsString()
  candidateId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class RequestPayoutDto {
  @IsNumber()
  amount: number;

  @IsString()
  paymentMethod: string;

  @IsObject()
  paymentDetails: any;
}

export class UpdatePayoutStatusDto {
  @IsEnum(PayoutStatus)
  status: PayoutStatus;

  @IsString()
  @IsOptional()
  failureReason?: string;

  @IsString()
  @IsOptional()
  paymentGatewayId?: string;
}
