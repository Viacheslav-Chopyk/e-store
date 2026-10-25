import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module.js';
import { Product } from '../products/product.entity.js';

interface MockProduct extends Omit<Product, 'id' | 'rating'> {
  rating: string | number;
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  const dataSource = app.get(DataSource);

  const file = resolve(process.cwd(), '../mock-data/db.json');
  const { products } = JSON.parse(await readFile(file, 'utf-8')) as { products: MockProduct[] };

  await dataSource.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
  await dataSource.getRepository(Product).save(
    products.map(({ name, type, price, rating, description, images, reviews }) => ({
      name,
      type,
      price,
      rating: Number(rating),
      description,
      images,
      reviews,
    })),
    { chunk: 100 },
  );

  console.log(`Seeded ${products.length} products`);
  await app.close();
}

await seed();
