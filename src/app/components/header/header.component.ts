import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartItemCount } from '../../store/cart/cart.selectors';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NzHeaderComponent} from 'ng-zorro-antd/layout';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzBadgeComponent} from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    NzHeaderComponent,
    NzButtonComponent,
    NzIconDirective,
    NzBadgeComponent,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private store = inject(Store);
  private router = inject(Router);
  authService = inject(AuthService);
  cartItemCount = this.store.selectSignal(selectCartItemCount);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
