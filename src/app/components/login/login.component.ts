import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, FieldTree, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzSegmentedComponent } from 'ng-zorro-antd/segmented';
import { AuthService } from '../../services/auth.service';
import { EAuthMode } from '../../models/auth-mode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    FormField,
    FormRoot,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonComponent,
    NzAlertComponent,
    NzSegmentedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly EAuthMode = EAuthMode;

  readonly modeOptions = [
    { label: 'Log in', value: EAuthMode.Login },
    { label: 'Sign up', value: EAuthMode.Register }
  ];

  mode = signal<EAuthMode>(EAuthMode.Login);
  error = signal<string | null>(null);

  private model = signal({ name: '', email: '', password: '' });

  form = form(
    this.model,
    (path) => {
      const isRegister = () => this.mode() === EAuthMode.Register;
      required(path.name, { when: isRegister });
      minLength(path.name, 2, { when: isRegister });
      required(path.email);
      email(path.email);
      required(path.password);
      minLength(path.password, 6);
    },
    {
      submission: { action: () => this.send() }
    }
  );

  setMode(mode: EAuthMode) {
    this.mode.set(mode);
    this.error.set(null);
  }

  status(field: FieldTree<string>): 'error' | '' {
    const state = field();
    return state.touched() && state.invalid() ? 'error' : '';
  }

  private async send() {
    const { name, email, password } = this.model();
    try {
      await firstValueFrom(
        this.mode() === EAuthMode.Login
          ? this.authService.login({ email, password })
          : this.authService.register({ name, email, password })
      );
      await this.router.navigate(['/']);
    } catch (err) {
      this.error.set(this.toMessage(err as HttpErrorResponse));
    }
    return undefined;
  }

  private toMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Server is not available';
    }
    const message = err.error?.message;
    return Array.isArray(message) ? message.join(', ') : message ?? 'Something went wrong';
  }
}
