import {
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
    IsUrl,
    Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Wireless Headphones' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'High-quality wireless headphones with noise cancellation' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 99.99 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 'USD' })
    @IsString()
    @IsOptional()
    currency?: string;

    @ApiPropertyOptional({ example: 100 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ example: 'https://example.com/product.jpg' })
    @IsUrl()
    @IsOptional()
    imageUrl?: string;
}
