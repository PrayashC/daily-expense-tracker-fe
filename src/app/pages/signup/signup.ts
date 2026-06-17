import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, finalize } from 'rxjs';
import { UserService } from '../../services/user-service';
import { TextBox } from '../../components/text-box/text-box';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, TextBox, Button],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  loading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    combineLatest([
      this.signupForm.controls['password'].valueChanges,
      this.signupForm.controls['confirmPassword'].valueChanges,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([password, confirmPassword]) => {
        if (password && confirmPassword && password !== confirmPassword) {
          this.signupForm.controls['confirmPassword'].setErrors({ mismatch: true });
        }
      });

    this.signupForm.controls['confirmPassword'].disable();

    this.signupForm.controls['password'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        if (value !== '') {
          this.signupForm.controls['confirmPassword'].enable();
        }
      });
  }

  protected readonly signupForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected onSubmit(): void {
    if (this.loading() || this.signupForm.invalid) {
      return;
    }

    this.loading.set(true);
    const username = this.signupForm.controls['username'].value;
    const confirmPassword = this.signupForm.controls['confirmPassword'].value;

    this.userService
      .userSignin(username, confirmPassword)
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

  signIn() {
    this.router.navigate(['login']);
  }
}
