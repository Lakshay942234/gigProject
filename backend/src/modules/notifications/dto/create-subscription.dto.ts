import { IsNotEmpty, IsString, IsObject } from 'class-validator';

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
}
