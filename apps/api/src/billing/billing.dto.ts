import { IsString, IsUrl } from 'class-validator';

export class CheckoutInputDto {
  @IsString() orgId!: string;
  @IsString() planCode!: string;
  @IsUrl()    successUrl!: string;
  @IsUrl()    cancelUrl!: string;
}
