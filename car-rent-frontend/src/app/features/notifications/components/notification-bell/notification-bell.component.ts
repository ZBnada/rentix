import { Component, OnInit, OnDestroy, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationFacadeService } from '@features/notifications/services/notification-facade.service';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, NotificationPanelComponent],
  template: `
    <div class="relative">
      <!-- Bell Button -->
      <button
        (click)="togglePanel()"
        class="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        type="button"
        aria-label="Notifications">
        
        <!-- Bell Icon -->
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        <!-- Badge (nombre de notifications non lues) -->
        @if ((unreadCount$ | async)! > 0) {
          <span
            class="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {{ unreadCount$ | async }}
          </span>
        }
      </button>

      <!-- Notification Panel (avec #panel pour la référence) -->
      @if (showPanel) {
        <div #panel class="absolute right-0 mt-2 z-50">
          <app-notification-panel (closePanel)="closePanel()" />
        </div>
      }
    </div>
  `,
  styles: []
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private notificationFacade = inject(NotificationFacadeService);
  private elementRef = inject(ElementRef);
  private destroy$ = new Subject<void>();

  showPanel = false;
  unreadCount$ = this.notificationFacade.getUnreadCount();

  ngOnInit(): void {
    // Rien à faire ici, l'initialisation se fait dans le header
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle le panel
   */
  togglePanel(): void {
    this.showPanel = !this.showPanel;
  }

  /**
   * Fermer le panel
   */
  closePanel(): void {
    this.showPanel = false;
  }

  /**
   * 👆 FERMER LE PANEL QUAND ON CLIQUE EN DEHORS
   * HostListener écoute tous les clicks sur le document
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Si le panel n'est pas ouvert, ne rien faire
    if (!this.showPanel) {
      return;
    }

    // Vérifier si le click est à l'intérieur du composant
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    // Si le click est en dehors, fermer le panel
    if (!clickedInside) {
      this.showPanel = false;
    }
  }

  /**
   * Alternative: Fermer avec la touche Escape
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showPanel) {
      this.showPanel = false;
    }
  }
}