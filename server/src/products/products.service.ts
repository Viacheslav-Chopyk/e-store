import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedProducts } from './dto/paginated-products.dto.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
import { Product } from './product.entity.js';
import {CreateProductDto} from './dto/create-product.dto.js';
import {UpdateProductDto} from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(query: QueryProductsDto): Promise<PaginatedProducts> {
    const { search, type, minPrice, maxPrice, page, limit } = query;
    const qb = this.productsRepository.createQueryBuilder('product');

    if (search?.trim()) {
      const escaped = search.trim().replace(/[\\%_]/g, '\\$&');
      qb.andWhere('product.name ILIKE :search', { search: `%${escaped}%` });
    }
    if (type) {
      qb.andWhere('product.type = :type', { type });
    }
    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const [items, total] = await qb
      .orderBy('product.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total, page, limit };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  async removeItem(id: number): Promise<void> {
    const result = await this.productsRepository.delete({ id });
    if (!result.affected) {
      throw new NotFoundException(`Product ${id} not found`);
    }
  }

  createProduct(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(dto);
    return this.productsRepository.save(product);
  }

  async updateProduct(id:number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productsRepository.save(product);
  }
}
