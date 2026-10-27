import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsInt,
  Min,
  IsArray,
  IsOptional,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsString()
  @MinLength(10)
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
