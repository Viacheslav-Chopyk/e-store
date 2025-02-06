import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setFilters } from '../../store/products/products.actions';
import { FilterOptions } from '../../models/filter-options';
import {MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';


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
  selectedType = 'All';
  selectedPriceRanges: number[] = [];

  types = ['All', 'TVs', 'Appliances', 'Phones', 'Video Games'];
  priceRanges = [500, 1000, 1500, 2000];

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
