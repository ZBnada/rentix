import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    forgotPasswordForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    constructor() {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.forgotPasswordForm.invalid) {
            this.forgotPasswordForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
            next: (response) => {
                this.successMessage.set(response.message);

                // Rediriger vers la page de reset après 2 secondes
                setTimeout(() => {
                    this.router.navigate(['/auth/reset-password'], {
                        queryParams: { email: this.forgotPasswordForm.value.email }
                    });
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
        const field = this.forgotPasswordForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Email is required';
        }
        if (field?.hasError('email')) {
            return 'Invalid email format';
        }
        return '';
    }
}