import { Component, inject, signal, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    toggleSidebar = output<void>();

    showUserDropdown = signal(false);
    isDarkMode = signal(false);

    // Avatar state
    userAvatarUrl = signal<string | null>(null);
    useDefaultAvatar = signal(false);

    ngOnInit(): void {
        // Charger le thème depuis localStorage
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.isDarkMode.set(true);
            document.documentElement.classList.add('dark');
        } else {
            this.isDarkMode.set(false);
            document.documentElement.classList.remove('dark');
        }

        // Charger l'avatar de l'utilisateur
        this.loadUserAvatar();
    }

    /**
     * Charger l'avatar depuis le token JWT
     * Le backend envoie déjà l'URL complète via le mapper
     */
    private loadUserAvatar(): void {
        const user = this.authService.getCurrentUser();

        if (!user) {
            this.useDefaultAvatar.set(true);
            return;
        }

        // Le backend envoie profileImage avec l'URL complète
        // Vérifier si l'utilisateur a une image de profil
        if (user.profileImage) {
            this.userAvatarUrl.set(user.profileImage);
            this.useDefaultAvatar.set(false);
        } else {
            // Pas d'image dans le token -> utiliser l'image par défaut
            this.userAvatarUrl.set('assets/images/default-avatar.png');
            this.useDefaultAvatar.set(true);
        }
    }

    /**
     * Gestion d'erreur de chargement d'image
     * Si l'image ne charge pas, basculer vers l'image par défaut
     */
    onAvatarError(): void {
        console.warn('Failed to load user avatar, falling back to default');
        this.userAvatarUrl.set('assets/images/default-avatar.png');
        this.useDefaultAvatar.set(true);
    }

    /**
     * Récupérer le nom complet de l'utilisateur
     */
    getUserName(): string {
        const user = this.authService.getCurrentUser();
        return user ? `${user.firstName} ${user.lastName}` : 'User';
    }

    /**
     * Récupérer l'email de l'utilisateur
     */
    getUserEmail(): string {
        const user = this.authService.getCurrentUser();
        return user?.email || 'user@example.com';
    }

    /**
     * Récupérer les initiales de l'utilisateur
     * Utilisé comme fallback si l'image par défaut ne charge pas
     */
    getUserInitials(): string {
        const user = this.authService.getCurrentUser();

        // Si le backend envoie déjà les initials dans le token
        if (user?.initials) {
            return user.initials;
        }

        // Sinon, calculer les initiales
        if (!user) return 'U';
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }

    /**
     * Vérifier si on doit afficher l'image ou les initiales
     */
    shouldShowImage(): boolean {
        return this.userAvatarUrl() !== null && !this.useDefaultAvatar();
    }

    handleToggleSidebar(): void {
        this.toggleSidebar.emit();
    }

    toggleUserDropdown(): void {
        this.showUserDropdown.set(!this.showUserDropdown());
    }

    closeUserDropdown(): void {
        this.showUserDropdown.set(false);
    }

    toggleDarkMode(): void {
        const newValue = !this.isDarkMode();
        this.isDarkMode.set(newValue);

        if (newValue) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    navigateToProfile(): void {
        this.closeUserDropdown();
        this.router.navigate(['/dashboard/profile']);
    }

    navigateToSettings(): void {
        this.closeUserDropdown();
        this.router.navigate(['/dashboard/settings']);
    }

    handleSupport(): void {
        this.closeUserDropdown();
        alert('Support feature coming soon!');
    }

    handleLogout(): void {
        this.closeUserDropdown();
        this.authService.logout();
    }
}