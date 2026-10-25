import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PaginatedProducts } from './dto/paginated-products.dto.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
import { Product } from './product.entity.js';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: QueryProductsDto): Promise<PaginatedProducts> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }
}
