import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Order } from '../constants';

export class PageOptionsDto {
  // @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  order?: Order = Order.ASC;

  // @ApiPropertyOptional({
  //   minimum: 1,
  //   default: 1,
  // })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  // @ApiPropertyOptional({
  //   minimum: 1,
  //   maximum: 50,
  //   default: 10,
  // })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  take?: number = 10;

  // @ApiPropertyOptional({
  //   default: '',
  // })
  @IsOptional()
  orderBy?: string = '';

  // @ApiPropertyOptional({
  //   default: '',
  // })
  @IsOptional()
  search?: string = '';

  @IsOptional()
  roles?: string = '';

  @IsOptional()
  status?: boolean;

  // @IsOptional()
  // username?: string = '';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  skip?: number;
}
