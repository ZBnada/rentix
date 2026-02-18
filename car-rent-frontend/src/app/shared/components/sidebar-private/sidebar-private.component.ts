import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
    label: string;
    icon: string;
    route?: string;
    children?: MenuItem[];
    badge?: string;
    badgeType?: 'success' | 'warning' | 'info' | 'danger';
}

@Component({
    selector: 'app-sidebar-private',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar-private.component.html',
    styleUrls: ['./sidebar-private.component.css']
})
export class SidebarPrivateComponent {
    isOpen = input.required<boolean>();
    closeSidebar = output<void>();

    expandedMenus = signal<Set<string>>(new Set());
    isMinimized = signal(false);

    menuItems: MenuItem[] = [
        {
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/dashboard'
        },
        {
            label: 'Calendar',
            icon: 'calendar',
            route: '/dashboard/calendar'
        },
        {
            label: 'Fleet Management',
            icon: 'truck',
            children: [
                {
                    label: 'Vehicles',
                    icon: 'car',
                    route: '/dashboard/vehicles'
                },
                {
                    label: 'Vehicle Brands',
                    icon: 'tag',
                    route: '/dashboard/vehicle-brands'
                }
            ]
        },
        {
            label: 'Maintenance',
            icon: 'wrench',
            badge: '3',
            badgeType: 'danger',
            children: [
                {
                    label: 'entretiens-a-suivre',
                    icon: 'clipboard-check',
                    route: '/dashboard/entretiens-a-suivre'
                },
                {
                    label: 'Carnet d\'Entretien',
                    icon: 'book-open',
                    route: '/dashboard/carnet-entretien'
                },
                {
                    label: 'Maintenance Types',
                    icon: 'list',
                    route: '/dashboard/type-entretien'
                }
            ]
        },
        {
            label: 'Insurance',
            icon: 'shield',
            children: [
                {
                    label: 'Insurance Policies',
                    icon: 'document-text',
                    route: '/dashboard/Insurance'
                }
            ]
        },
        {
            label: 'Stickers',
            icon: 'badge-check',
            route: '/dashboard/vignettes'
        },
        {
            label: 'Technical Control',
            icon: 'clipboard-check',
            route: '/dashboard/controle-technique'
        },
        // ⭐ NOUVEAU : Menu Mode Paiement
        {
            label: 'Payment Methods',
            icon: 'credit-card',
            route: '/dashboard/modes-paiement'
        },
        {
            label: 'Notifications',
            icon: 'bell',
            route: '/dashboard/notifications',
            badge: '5',
            badgeType: 'warning'
        },
        {
            label: 'Users',
            icon: 'users',
            children: [
                {
                    label: 'User List',
                    icon: 'user-group',
                    route: '/dashboard/users'
                },
                {
                    label: 'Roles & Permissions',
                    icon: 'shield-check',
                    route: '/dashboard/roles'
                }
            ]
        },
        {
            label: 'My Profile',
            icon: 'user-circle',
            route: '/dashboard/profil'
        },
        {
            label: 'Settings',
            icon: 'cog',
            children: [
                {
                    label: 'Configuration',
                    icon: 'adjustments',
                    route: '/dashboard/settings'
                },
                {
                    label: 'File Manager',
                    icon: 'folder-open',
                    route: '/dashboard/file-manager'
                }
            ]
        }
    ];

    handleCloseSidebar(): void {
        this.closeSidebar.emit();
    }

    toggleMenu(label: string): void {
        if (this.isMinimized()) return;

        const expanded = this.expandedMenus();
        if (expanded.has(label)) {
            expanded.delete(label);
        } else {
            expanded.add(label);
        }
        this.expandedMenus.set(new Set(expanded));
    }

    isMenuExpanded(label: string): boolean {
        return this.expandedMenus().has(label);
    }

    toggleMinimize(): void {
        this.isMinimized.set(!this.isMinimized());
        if (this.isMinimized()) {
            this.expandedMenus.set(new Set());
        }
    }

    /**
     * Maps icon names to Heroicons SVG paths
     */
    getIcon(iconName: string): string {
        const icons: Record<string, string> = {
            // Navigation
            dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',

            // Véhicules
            truck: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0h-.01M15 8h.01',
            car: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0h-.01M15 8h.01',
            tag: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',

            // Maintenance
            wrench: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
            'clipboard-check': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
            list: 'M4 6h16M4 10h16M4 14h16M4 18h16',

            // Assurances & Documents
            shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            'shield-check': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            'document-text': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            'office-building': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
            'badge-check': 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',

            // ⭐ NOUVEAU : Icône Carte de Crédit pour Mode Paiement
            'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',

            // Notifications
            bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',

            // Utilisateurs
            users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            'user-group': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            'user-circle': 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            'book-open': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
            // Paramètres
            cog: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
            adjustments: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
            'folder-open': 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z',
            folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
        };

        return icons[iconName] || icons['dashboard'];
    }

    /**
     * Get badge color classes
     */
    getBadgeClasses(badgeType: 'success' | 'warning' | 'info' | 'danger' = 'info'): string {
        const classes = {
            success: 'bg-green-500 text-white',
            warning: 'bg-orange-500 text-white',
            info: 'bg-blue-500 text-white',
            danger: 'bg-red-500 text-white'
        };
        return classes[badgeType];
    }
}