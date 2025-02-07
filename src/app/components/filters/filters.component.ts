import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setFilters } from '../../store/products/products.actions';
import { FilterOptions } from '../../models/filter-options';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import {ALL_TYPES, PRICE_RANGES, PRODUCT_TYPES} from './constans/filter.constants';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  imports: [
    MatFormField,
    FormsModule,
    MatSelect,
    MatOption,
    MatInput
  ],
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  searchText = '';
  selectedType = ALL_TYPES;
  selectedPriceRanges: number[] = [];

  types = PRODUCT_TYPES;
  priceRanges = PRICE_RANGES;

  constructor(private store: Store) {}

  applyFilters() {
    const filters: FilterOptions = {
      searchText: this.searchText,
      type: this.selectedType,
      priceRanges: this.selectedPriceRanges
    };
    this.store.dispatch(setFilters({ filters }));
  }

  togglePriceRange(price: number) {
    if (this.selectedPriceRanges.includes(price)) {
      this.selectedPriceRanges = this.selectedPriceRanges.filter(p => p !== price);
    } else {
      this.selectedPriceRanges = [...this.selectedPriceRanges, price];
    }
    this.applyFilters();
  }
}
