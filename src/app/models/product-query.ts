import {IProduct} from './product';

export interface IProductQuery {
  search?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}

export interface IPaginatedProducts {
  items: IProduct[];
  total: number;
  page: number;
  limit: number;
}
