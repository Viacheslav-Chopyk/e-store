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

type Mode = 'login' | 'register';

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

  readonly modeOptions = [
    { label: 'Log in', value: 'login' },
    { label: 'Sign up', value: 'register' }
  ];

  mode = signal<Mode>('login');
  error = signal<string | null>(null);

  // The form's value lives in this signal; form() builds field state (errors, touched...) around it.
  private model = signal({ name: '', email: '', password: '' });

  form = form(
    this.model,
    (path) => {
      // Name is only asked for on sign up — `when` re-evaluates whenever mode() changes.
      const isRegister = () => this.mode() === 'register';
      required(path.name, { when: isRegister });
      minLength(path.name, 2, { when: isRegister });
      required(path.email);
      email(path.email);
      required(path.password);
      minLength(path.password, 6);
    },
    {
      // Runs on <form [formRoot]> submit, only when the form is valid. Invalid fields get marked as touched.
      submission: { action: () => this.send() }
    }
  );

  setMode(mode: Mode) {
    this.mode.set(mode);
    this.error.set(null);
  }

  // nz-form-control shows nzErrorTip only when its status is 'error'.
  status(field: FieldTree<string>): 'error' | '' {
    const state = field();
    return state.touched() && state.invalid() ? 'error' : '';
  }

  private async send() {
    const { name, email, password } = this.model();
    // Keep the previous error visible while the request is in flight: hiding it would shrink the card
    // and make it jump. It is replaced by the next error, or goes away with the page on success.
    try {
      await firstValueFrom(
        this.mode() === 'login'
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
