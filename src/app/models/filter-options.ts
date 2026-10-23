export interface IFilterOptions {
  searchText: string;
  type: string;
  priceRanges: number[];
  minPrice: number | null;
  maxPrice: number | null;
}
