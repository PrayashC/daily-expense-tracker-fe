import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UserService } from '../../services/user-service';
import { TextBox } from '../../components/text-box/text-box';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TextBox, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  loading = signal(false);
  errorMessage = signal('');

  protected readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected onSubmit(): void {
    if (this.loading() || this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;
    this.userService
      .userLogin(username, password)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.router.navigate(['dashboard']);
          }
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message);
        },
      });
  }

  signUp() {
    this.router.navigate(['signup']);
  }
}
