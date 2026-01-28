import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  activeTab = signal<string>('cars');
  differentLocation = signal<boolean>(false);

  pickupLocation = signal<string>('Athens International Airport');
  pickupDate = signal<string>('2026-01-10');
  pickupTime = signal<string>('12:00');
  returnDate = signal<string>('2026-01-14');
  returnTime = signal<string>('12:00');

  tabs: Tab[] = [
    { id: 'cars', label: 'Cars', icon: 'car' },
    { id: 'trucks', label: 'Trucks', icon: 'truck' },
    { id: 'subscription', label: 'Subscription', icon: 'calendar' }
  ];

  selectTab(tabId: string): void {
    this.activeTab.set(tabId);
  }

  toggleDifferentLocation(): void {
    this.differentLocation.set(!this.differentLocation());
  }

  showCars(): void {
    console.log('Recherche de voitures...', {
      pickup: this.pickupLocation(),
      pickupDate: this.pickupDate(),
      pickupTime: this.pickupTime(),
      returnDate: this.returnDate(),
      returnTime: this.returnTime(),
      differentLocation: this.differentLocation()
    });
  }

  getIcon(iconName: string): string {
    const icons: Record<string, string> = {
      'car': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
      'truck': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1-1V9m4 0h4v5h-4V9z"/></svg>',
      'calendar': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
    };
    return icons[iconName] || '';
  }
}