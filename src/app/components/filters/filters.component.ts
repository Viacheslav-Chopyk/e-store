import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { setFilters } from '../../store/products/products.actions';
import { IFilterOptions } from '../../models/filter-options';
import { FormsModule } from '@angular/forms';
import { NzInputDirective, NzInputPrefixDirective, NzInputWrapperComponent } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {ALL_TYPES, PRICE_RANGES, PRODUCT_TYPES} from './constans/filter.constants';
import {NzButtonComponent} from 'ng-zorro-antd/button';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  imports: [
    FormsModule,
    NzInputWrapperComponent,
    NzInputDirective,
    NzInputPrefixDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzInputNumberComponent,
    NzCheckboxComponent,
    NzIconDirective,
    NzButtonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  searchText = '';
  selectedType = ALL_TYPES;
  selectedPriceRanges: number[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;

  types = PRODUCT_TYPES;
  priceRanges = PRICE_RANGES;

  constructor(private store: Store) {}

  applyFilters() {
    const filters: IFilterOptions = {
      searchText: this.searchText,
      type: this.selectedType,
      priceRanges: this.selectedPriceRanges,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    };
    console.log(filters)
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
