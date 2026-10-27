import {
  Controller,
  Delete,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Body
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedProducts } from './dto/paginated-products.dto.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
import { Product } from './product.entity.js';
import { ProductsService } from './products.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { ERole } from '../users/role.enum.js';
import { RolesGuard } from '../auth/roles.guard.js';
import {CreateProductDto} from './dto/create-product.dto.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /** Filtered, paginated product list */
  @Get()
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  findAll(@Query() query: QueryProductsDto): Promise<PaginatedProducts> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Product not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.Admin])
  @ApiNotFoundResponse({ description: 'Product not found' })
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.removeItem(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.Admin])
  create(@Body() dto:CreateProductDto):Promise<Product> {
    return this.productsService.createProduct(dto)
  }
}
