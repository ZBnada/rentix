import { Component, inject, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserType, COUNTRIES } from '../../models/auth.types';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  userType = input.required<UserType>();

  registerForm: FormGroup;
  companyForm: FormGroup;

  currentStep = signal(1);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  readonly UserType = UserType;
  readonly countries = COUNTRIES;

  selectedCountryCode = signal('+216');
  selectedCountryRegistration = signal('Tunisia');
  isCountryDropdownOpen = signal(false);
  isRegistrationDropdownOpen = signal(false);

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]]
    });

    this.companyForm = this.fb.group({
      countryOfRegistration: ['Tunisia', [Validators.required]],
      legalCompanyName: ['', [Validators.required]],
      streetAddress: ['', [Validators.required]],
      houseNumber: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
  }

  selectCountryCode(dialCode: string): void {
    this.selectedCountryCode.set(dialCode);
    this.isCountryDropdownOpen.set(false);
  }

  selectCountryRegistration(country: string): void {
    this.selectedCountryRegistration.set(country);
    this.companyForm.patchValue({ countryOfRegistration: country });
    this.isRegistrationDropdownOpen.set(false);
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  nextStep(): void {
    if (this.userType() === UserType.INDIVIDUAL) {
      this.submitRegistration();
    } else {
      if (this.currentStep() === 1) {
        if (this.registerForm.invalid) {
          this.registerForm.markAllAsTouched();
          return;
        }
        this.currentStep.set(2);
      } else {
        this.submitRegistration();
      }
    }
  }

  previousStep(): void {
    this.currentStep.set(1);
  }

  submitRegistration(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (this.userType() === UserType.COMPANY && this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const registerData = {
      ...this.registerForm.value,
      countryCodePhone: this.selectedCountryCode(),
      userType: this.userType(),
      ...(this.userType() === UserType.COMPANY ? this.companyForm.value : {})
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/auth/verify-email'], {
          queryParams: { email: this.registerForm.value.email }
        });
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

  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.hasError('email')) {
      return 'Invalid email format';
    }
    if (field.hasError('minlength')) {
      return 'Password must be at least 8 characters';
    }
    if (field.hasError('pattern')) {
      if (fieldName === 'password') {
        return 'Password must contain uppercase, lowercase, number and special character';
      }
      if (fieldName === 'phoneNumber') {
        return 'Phone number must be 8-15 digits';
      }
    }
    return '';
  }
}