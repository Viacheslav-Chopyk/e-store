import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzSegmentedComponent } from 'ng-zorro-antd/segmented';
import { AuthService } from '../../services/auth.service';

type Mode = 'login' | 'register';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputDirective,
    NzButtonComponent,
    NzAlertComponent,
    NzSegmentedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly modeOptions = [
    { label: 'Log in', value: 'login' },
    { label: 'Sign up', value: 'register' }
  ];

  mode = signal<Mode>('login');
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  setMode(mode: Mode) {
    this.mode.set(mode);
    this.error.set(null);
    const name = this.form.controls.name;
    name.setValidators(mode === 'register' ? [Validators.required, Validators.minLength(2)] : []);
    name.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const { name, email, password } = this.form.getRawValue();
    const request$ = this.mode() === 'login'
      ? this.authService.login({ email, password })
      : this.authService.register({ name, email, password });

    this.loading.set(true);
    this.error.set(null);
    request$.subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(this.toMessage(err));
      }
    });
  }

  private toMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Server is not available';
    }
    const message = err.error?.message;
    return Array.isArray(message) ? message.join(', ') : message ?? 'Something went wrong';
  }
}
