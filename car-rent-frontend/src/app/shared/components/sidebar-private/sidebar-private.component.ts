import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
    label: string;
    icon: string;
    route?: string;
    children?: MenuItem[];
    badge?: string;
    badgeType?: 'success' | 'warning' | 'info';
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
            label: 'User Management',
            icon: 'users',
            children: [
                {
                    label: 'Users',
                    icon: 'user-circle',
                    route: '/dashboard/users'
                },
                {
                    label: 'Roles & Permissions',
                    icon: 'shield',
                    route: '/dashboard/roles'
                }
            ]
        },
        {
            label: 'User Profile',
            icon: 'user-circle',
            route: '/dashboard/profile'
        },
        {
            label: 'Pages',
            icon: 'pages',
            children: [
                {
                    label: 'Settings',
                    icon: 'settings',
                    route: '/dashboard/settings'
                },
                {
                    label: 'File Manager',
                    icon: 'folder',
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
            dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            truck: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0h-.01M15 8h.01',
            car: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0h-.01M15 8h.01',
            tag: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
            users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            'user-circle': 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            pages: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
            folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
            settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
        };

        return icons[iconName] || icons['dashboard'];
    }
}