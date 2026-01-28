import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarPrivateComponent } from '../../components/sidebar-private/sidebar-private.component';

/**
 * Admin Layout - Layout principal pour toute l'interface d'administration
 * Utilisé pour: Dashboard, Vehicles, Bookings, Users, Settings, etc.
 *
 * Ce layout encapsule:
 * - Header (avec search, dark mode, notifications, user dropdown)
 * - Sidebar (menu navigation)
 * - RouterOutlet (contenu dynamique de chaque page)
 */
@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        HeaderComponent,
        SidebarPrivateComponent
    ],
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
    sidebarOpen = signal(false);

    toggleSidebar(): void {
        this.sidebarOpen.set(!this.sidebarOpen());
    }

    closeSidebar(): void {
        this.sidebarOpen.set(false);
    }
}