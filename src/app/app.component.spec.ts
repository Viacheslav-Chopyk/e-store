import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { ERoles } from './models/user';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      // The header needs the store (cart count), router links and AuthService (HttpClient).
      providers: [provideRouter([]), provideHttpClient(), provideMockStore({ initialState: { cart: { items: [] } } })],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'electronics-store' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('electronics-store');
  });

  it('should not render the header for a guest', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeNull();
  });

  it('should render the header for a logged-in user', async () => {
    TestBed.inject(AuthService).user.set({
      id: 1, email: 'test@test.com', name: 'Test', createdAt: '', role: ERoles.User
    });
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo')?.textContent).toContain('Electronics Store');
  });
});
