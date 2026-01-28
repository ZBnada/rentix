import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    email = signal<string>('');
    resetPasswordForm: FormGroup;

    isLoading = signal(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);
    showPassword = signal(false);
    showConfirmPassword = signal(false);

    constructor() {
        this.resetPasswordForm = this.fb.group({
            code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
            newPassword: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            ]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        const emailParam = this.route.snapshot.queryParamMap.get('email');
        if (emailParam) {
            this.email.set(emailParam);
        } else {
            this.router.navigate(['/auth/forgot-password']);
        }
    }

    passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
        const password = form.get('newPassword');
        const confirmPassword = form.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }

    togglePasswordVisibility(field: 'password' | 'confirm'): void {
        if (field === 'password') {
            this.showPassword.set(!this.showPassword());
        } else {
            this.showConfirmPassword.set(!this.showConfirmPassword());
        }
    }

    onSubmit(): void {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        const { code, newPassword } = this.resetPasswordForm.value;

        this.authService.resetPassword({
            email: this.email(),
            code,
            newPassword
        }).subscribe({
            next: (response) => {
                this.successMessage.set(response.message);

                // Rediriger vers la page de login après 2 secondes
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 2000);
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

    getFieldError(fieldName: string): string {
        const field = this.resetPasswordForm.get(fieldName);
        if (!field) return '';

        if (field.hasError('required')) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        if (field.hasError('pattern')) {
            if (fieldName === 'code') {
                return 'Code must be exactly 6 digits';
            }
            if (fieldName === 'newPassword') {
                return 'Password must contain uppercase, lowercase, number and special character';
            }
        }
        if (field.hasError('minlength')) {
            return 'Password must be at least 8 characters';
        }
        if (field.hasError('passwordMismatch')) {
            return 'Passwords do not match';
        }
        return '';
    }
}