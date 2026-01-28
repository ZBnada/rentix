import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  email = signal<string>('');
  codeForm: FormGroup;

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  timeRemaining = signal(180); // 3 minutes en secondes
  canResend = signal(false);

  private timerSubscription?: Subscription;

  constructor() {
    this.codeForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit6: ['', [Validators.required, Validators.pattern(/^\d$/)]]
    });
  }

  ngOnInit(): void {
    const emailParam = this.route.snapshot.queryParamMap.get('email');
    if (emailParam) {
      this.email.set(emailParam);
      this.startTimer();
    } else {
      this.router.navigate(['/auth/register']);
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  startTimer(): void {
    this.timeRemaining.set(180);
    this.canResend.set(false);

    this.timerSubscription = interval(1000).subscribe(() => {
      const current = this.timeRemaining();
      if (current > 0) {
        this.timeRemaining.set(current - 1);
      } else {
        this.canResend.set(true);
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeRemaining() / 60);
    const seconds = this.timeRemaining() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && /^\d$/.test(value)) {
      if (index < 6) {
        const nextInput = document.getElementById(`digit${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const input = event.target as HTMLInputElement;
      if (!input.value && index > 1) {
        const prevInput = document.getElementById(`digit${index - 1}`) as HTMLInputElement;
        prevInput?.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text');

    if (pasteData && /^\d{6}$/.test(pasteData)) {
      for (let i = 0; i < 6; i++) {
        this.codeForm.get(`digit${i + 1}`)?.setValue(pasteData[i]);
      }
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.codeForm.invalid) {
      return;
    }

    const code = Object.values(this.codeForm.value).join('');

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.verifyEmail({
      email: this.email(),
      code
    }).subscribe({
      next: (response) => {
        this.successMessage.set(response.message);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.codeForm.reset();
        document.getElementById('digit1')?.focus();
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  resendCode(): void {
    if (!this.canResend()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.resendVerificationCode(this.email()).subscribe({
      next: () => {
        this.successMessage.set('A new verification code has been sent to your email');
        this.startTimer();
        this.codeForm.reset();
        document.getElementById('digit1')?.focus();
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  changeEmail(): void {
    this.router.navigate(['/auth/register']);
  }
}