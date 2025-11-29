import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @IsObject()
  @IsNotEmpty()
  keys: {
    p256dh: string;
    auth: string;
  };

  @IsOptional()
  expirationTime?: number | null;
}
