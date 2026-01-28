import { Component, output, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { LoginModalComponent } from '../../../features/auth/components/login-modal/login-modal.component';
import { RegisterTypeModalComponent } from '../../../features/auth/components/register-type-modal/register-type-modal.component';
import { UserType } from '../../../features/auth/models/auth.types';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    LoginModalComponent,
    RegisterTypeModalComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);

  toggleSidebar = output<void>();

  showLoginModal = signal(false);
  showRegisterTypeModal = signal(false);

  // Computed pour vérifier si l'utilisateur est connecté
  isLoggedIn = computed(() => this.authService.isAuthenticated());

  // Méthode pour basculer le sidebar
  handleToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  // ===== LOGIN =====
  openLoginModal(): void {
    this.showLoginModal.set(true);
    this.showRegisterTypeModal.set(false);
  }

  closeLoginModal(): void {
    this.showLoginModal.set(false);
  }

  // ===== REGISTER =====
  switchToRegister(): void {
    this.showLoginModal.set(false);
    this.showRegisterTypeModal.set(true);
  }

  closeRegisterTypeModal(): void {
    this.showRegisterTypeModal.set(false);
  }

  onSelectUserType(type: UserType): void {
    console.log('✅ [Navbar] User type selected:', type);

    // Fermer le modal
    this.closeRegisterTypeModal();

    // Naviguer vers la page de register avec le type en query param
    this.router.navigate(['/auth/register'], {
      queryParams: { type }
    });
  }

  // ===== LOGOUT =====
  logout(): void {
    this.authService.logout();
  }

  // Obtenir le prénom de l'utilisateur
  getUserFirstName(): string {
    return this.authService.getCurrentUser()?.firstName || 'User';
  }
}