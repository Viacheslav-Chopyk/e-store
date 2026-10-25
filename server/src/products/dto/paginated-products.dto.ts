import { Product } from '../product.entity.js';

export class PaginatedProducts {
  items: Product[];

  /** Number of products matching the filters, across all pages */
  total: number;

  page: number;

  limit: number;
}
