// src/app/shared/components/header/header.component.ts
// VERSION PRODUCTION - SANS LOGS

import { Component, inject, signal, output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    private destroy$ = new Subject<void>();

    toggleSidebar = output<void>();

    showUserDropdown = signal(false);
    isDarkMode = signal(false);

    // Avatar state
    userAvatarUrl = signal<string | null>(null);
    useDefaultAvatar = signal(false);

    ngOnInit(): void {
        // Charger le thème
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.isDarkMode.set(true);
            document.documentElement.classList.add('dark');
        } else {
            this.isDarkMode.set(false);
            document.documentElement.classList.remove('dark');
        }

        // Charger l'avatar
        this.loadUserAvatar();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Charger l'avatar
     */
    private loadUserAvatar(): void {
        const user = this.authService.getCurrentUser();

        if (!user) {
            this.useDefaultAvatar.set(true);
            return;
        }

        if (user.profileImage) {
            this.userAvatarUrl.set(user.profileImage);
            this.useDefaultAvatar.set(false);
        } else {
            this.userAvatarUrl.set('assets/images/default-avatar.png');
            this.useDefaultAvatar.set(true);
        }
    }

    onAvatarError(): void {
        this.userAvatarUrl.set('assets/images/default-avatar.png');
        this.useDefaultAvatar.set(true);
    }

    getUserName(): string {
        const user = this.authService.getCurrentUser();
        return user ? `${user.firstName} ${user.lastName}` : 'User';
    }

    getUserEmail(): string {
        const user = this.authService.getCurrentUser();
        return user?.email || 'user@example.com';
    }

    getUserInitials(): string {
        const user = this.authService.getCurrentUser();

        if (user?.initials) {
            return user.initials;
        }

        if (!user) return 'U';
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }

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