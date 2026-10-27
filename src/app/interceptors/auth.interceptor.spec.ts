import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { ERoles, IAuthResponse } from '../models/user';

const API = 'http://localhost:3000/api';
const user = { id: 1, email: 'a@a.com', name: 'A', createdAt: '', role: ERoles.User };
const pair = (n: number): IAuthResponse => ({ accessToken: `access-${n}`, refreshToken: `refresh-${n}`, user });

describe('authInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.setItem('accessToken', 'access-1');
    localStorage.setItem('refreshToken', 'refresh-1');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(), provideRouter([])]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    backend.verify();
    localStorage.clear();
  });

  it('adds the access token', () => {
    http.get(`${API}/products`).subscribe();
    expect(backend.expectOne(`${API}/products`).request.headers.get('Authorization')).toBe('Bearer access-1');
  });

  it('refreshes once for parallel 401s and retries every request with the new token', () => {
    const results: unknown[] = [];
    http.get(`${API}/products`).subscribe(r => results.push(r));
    http.get(`${API}/auth/me`).subscribe(r => results.push(r));

    backend.expectOne(`${API}/products`).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(`${API}/auth/me`).flush(null, { status: 401, statusText: 'Unauthorized' });

    const refresh = backend.expectOne(`${API}/auth/refresh`);
    expect(refresh.request.body).toEqual({ refreshToken: 'refresh-1' });
    refresh.flush(pair(2));

    const retryProducts = backend.expectOne(`${API}/products`);
    const retryMe = backend.expectOne(`${API}/auth/me`);
    expect(retryProducts.request.headers.get('Authorization')).toBe('Bearer access-2');
    expect(retryMe.request.headers.get('Authorization')).toBe('Bearer access-2');
    retryProducts.flush('products');
    retryMe.flush('me');

    expect(results).toEqual(['products', 'me']);
    expect(localStorage.getItem('refreshToken')).toBe('refresh-2');
  });

  it('logs out and goes to /login when the refresh token is rejected', () => {
    let failed = false;
    http.get(`${API}/products`).subscribe({ error: () => (failed = true) });

    backend.expectOne(`${API}/products`).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(`${API}/auth/refresh`).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(`${API}/auth/logout`).flush(null, { status: 204, statusText: 'No Content' });

    expect(failed).toBe(true);
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('does not refresh on a failed login (wrong password)', () => {
    http.post(`${API}/auth/login`, {}).subscribe({ error: () => {} });
    backend.expectOne(`${API}/auth/login`).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectNone(`${API}/auth/refresh`);
  });
});
