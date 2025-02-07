export interface FilterOptions {
  searchText: string;
  type: string;
  priceRanges: number[];
  minPrice: number | null;
  maxPrice: number | null;
}
