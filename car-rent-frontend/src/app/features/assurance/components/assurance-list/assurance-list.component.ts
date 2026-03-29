import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { format, differenceInDays } from 'date-fns';
import { AssuranceService, Assurance } from '../../services/assurance.service';
import { AssuranceFormModalComponent } from '../assurance-form-modal/assurance-form-modal.component';

@Component({
    selector: 'app-assurance-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, AssuranceFormModalComponent],
    templateUrl: './assurance-list.component.html',
})
export class AssuranceListComponent implements OnInit, OnDestroy {
    private readonly assuranceService = inject(AssuranceService);
    private readonly router = inject(Router);
    private readonly destroy$ = new Subject<void>();

    assurances = signal<Assurance[]>([]);
    searchTerm = signal<string>('');
    filterStatus = signal<'all' | 'active' | 'expiring' | 'expired'>('all');
    isLoading = signal<boolean>(false);
    showFormModal = signal<boolean>(false);
    assuranceToEdit = signal<Assurance | null>(null);

    showDeleteConfirm = signal<boolean>(false);
    assuranceToDelete = signal<Assurance | null>(null);
    isDeletingAssurance = signal<boolean>(false);

    filteredAssurances = computed(() => {
        let list = this.assurances();
        const term = this.searchTerm().toLowerCase();
        if (term) {
            list = list.filter(
                (a) =>
                    a.prestataire.toLowerCase().includes(term) ||
                    a.numeroPolice?.toLowerCase().includes(term) ||
                    (a.vehicule?.immatriculation || '').toLowerCase().includes(term),
            );
        }
        const status = this.filterStatus();
        if (status === 'active') list = list.filter((a) => !this.isExpired(a) && !this.isExpiringSoon(a));
        if (status === 'expiring') list = list.filter((a) => this.isExpiringSoon(a));
        if (status === 'expired') list = list.filter((a) => this.isExpired(a));
        return list;
    });

    stats = computed(() => {
        const all = this.assurances();
        return {
            total: all.length,
            active: all.filter((a) => !this.isExpired(a) && !this.isExpiringSoon(a)).length,
            expiring: all.filter((a) => this.isExpiringSoon(a)).length,
            expired: all.filter((a) => this.isExpired(a)).length,
        };
    });

    ngOnInit(): void {
        // 1. Charger les données au démarrage
        this.loadAssurances();
    }

    ngOnDestroy(): void {
        // destroy$ ferme TOUTES les subscriptions automatiquement
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadAssurances(): void {
        this.isLoading.set(true);
        this.assuranceService
            .findAllAssurances()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    // 2. Mettre la liste à jour
                    this.assurances.set(data);
                    this.isLoading.set(false);

                    // 3. Ouvrir la subscription APRÈS avoir les données
                    //    On s'abonne sans filtre d'IDs → on reçoit TOUS les events
                    //    (create, update, delete pour n'importe quelle assurance)
                    this.listenToAssuranceUpdates();
                },
                error: () => {
                    this.isLoading.set(false);
                },
            });
    }

    /**
     * Ouvre la subscription WebSocket et réagit aux events en temps réel.
     *
     * Appelée UNE seule fois — elle reste active jusqu'à destruction du composant.
     * destroy$ ferme automatiquement la connexion WebSocket dans ngOnDestroy.
     *
     * Quand le serveur publie un event :
     *   - create → ajouter l'assurance dans la liste locale
     *   - update → remplacer l'assurance existante dans la liste
     *   - delete → retirer l'assurance de la liste
     */
    private listenToAssuranceUpdates(): void {
        this.assuranceService
            .assuranceUpdated()  // Sans IDs = écouter tous les changements
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ assuranceUpdated, action }) => {
                    console.log(`[Subscription] action: ${action}`, assuranceUpdated);

                    if (action === 'delete') {
                        // Supprimer l'assurance de la liste locale
                        this.assurances.update((list) =>
                            list.filter((a) => a.id !== assuranceUpdated.id),
                        );
                        return;
                    }

                    if (action === 'update') {
                        // Remplacer l'assurance modifiée dans la liste locale
                        this.assurances.update((list) =>
                            list.map((a) =>
                                a.id === assuranceUpdated.id
                                    ? { ...a, ...assuranceUpdated }  // merge des champs reçus
                                    : a,
                            ),
                        );
                        return;
                    }

                    if (action === 'create') {
                        // Ajouter la nouvelle assurance au début de la liste
                        this.assurances.update((list) => [assuranceUpdated as Assurance, ...list]);
                        return;
                    }
                },
                error: (err) => {
                    console.error('[Subscription] Erreur WebSocket:', err);
                    // En cas d'erreur, recharger les données manuellement
                    this.loadAssurances();
                },
            });
    }

    openCreateModal(): void {
        this.assuranceToEdit.set(null);
        this.showFormModal.set(true);
    }

    openEditModal(a: Assurance): void {
        this.assuranceToEdit.set(a);
        this.showFormModal.set(true);
    }

    closeFormModal(): void {
        this.showFormModal.set(false);
        this.assuranceToEdit.set(null);
    }

    // Après create/update depuis le modal → fermer juste le modal
    // La liste se met à jour automatiquement via la subscription
    onAssuranceCreated(_a: Assurance): void {
        this.closeFormModal();
        // PAS de loadAssurances() ici — la subscription s'en charge
    }

    onAssuranceUpdated(_a: Assurance): void {
        this.closeFormModal();
        // PAS de loadAssurances() ici — la subscription s'en charge
    }

    viewDetails(a: Assurance): void {
        this.router.navigate(['/dashboard/Insurance', a.id]);
    }

    openDeleteConfirm(a: Assurance, event: Event): void {
        event.stopPropagation();
        this.assuranceToDelete.set(a);
        this.showDeleteConfirm.set(true);
    }

    closeDeleteConfirm(): void {
        this.assuranceToDelete.set(null);
        this.showDeleteConfirm.set(false);
        this.isDeletingAssurance.set(false);
    }

    confirmDelete(): void {
        const a = this.assuranceToDelete();
        if (!a) return;
        this.isDeletingAssurance.set(true);
        this.assuranceService
            .deleteAssurance(a.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.closeDeleteConfirm();
                    // PAS de loadAssurances() ici — la subscription s'en charge
                },
                error: (err: Error) => {
                    console.error(err);
                    this.isDeletingAssurance.set(false);
                },
            });
    }

    onSearch(event: Event): void {
        this.searchTerm.set((event.target as HTMLInputElement).value);
    }

    onFilterChange(status: 'all' | 'active' | 'expiring' | 'expired'): void {
        this.filterStatus.set(status);
    }

    isExpired(a: Assurance): boolean {
        if (!a.dateFinValidite) return false;
        return new Date(a.dateFinValidite) < new Date();
    }

    isExpiringSoon(a: Assurance): boolean {
        if (!a.dateFinValidite || this.isExpired(a)) return false;
        return differenceInDays(new Date(a.dateFinValidite), new Date()) <= 30;
    }

    daysUntilExpiry(a: Assurance): number {
        if (!a.dateFinValidite) return 0;
        return differenceInDays(new Date(a.dateFinValidite), new Date());
    }

    formatDate(date: Date | string | null): string {
        if (!date) return '—';
        try {
            return format(new Date(date), 'dd/MM/yyyy');
        } catch {
            return '—';
        }
    }

    getVehiculeDisplay(a: Assurance): string {
        return a.vehicule?.immatriculation || '—';
    }

    getVehiculeMarque(a: Assurance): string {
        if (!a.vehicule) return '';
        return [a.vehicule.marque, a.vehicule.modele].filter(Boolean).join(' ');
    }

    getStatutConfig(a: Assurance): { label: string; dot: string; badge: string; row: string } {
        if (this.isExpired(a))
            return {
                label: 'Expired',
                dot: 'bg-red-500',
                badge: 'bg-red-50 text-red-600 border border-red-200',
                row: 'border-l-4 border-l-red-300',
            };
        if (this.isExpiringSoon(a))
            return {
                label: `D-${this.daysUntilExpiry(a)}`,
                dot: 'bg-amber-400',
                badge: 'bg-amber-50 text-amber-700 border border-amber-200',
                row: 'border-l-4 border-l-amber-300',
            };
        return {
            label: 'Active',
            dot: 'bg-emerald-500',
            badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            row: 'border-l-4 border-l-transparent',
        };
    }

    getTotalMontant(): number {
        return this.assurances().reduce((s, a) => s + Number(a.montantTotal), 0);
    }
}