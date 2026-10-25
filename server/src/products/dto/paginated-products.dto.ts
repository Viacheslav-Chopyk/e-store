import { Product } from '../product.entity.js';

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
