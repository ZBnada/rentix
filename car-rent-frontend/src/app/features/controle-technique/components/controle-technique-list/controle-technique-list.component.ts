import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { format } from 'date-fns';
import { ControleTechniqueService } from '../../services/controle-technique.service';
import { ControleTechnique, StatutControleTechnique } from '../../models/controle-technique.model';
import { ControleTechniqueFormComponent } from '../controle-technique-form/controle-technique-form.component';
import { ControleTechniqueDetailComponent } from '../controle-technique-detail/controle-technique-detail.component';

@Component({
    selector: 'app-controle-technique-list',
    standalone: true,
    imports: [CommonModule, ControleTechniqueFormComponent, ControleTechniqueDetailComponent],
    templateUrl: './controle-technique-list.component.html',
})
export class ControleTechniqueListComponent implements OnInit, OnDestroy {
    private readonly ctService  = inject(ControleTechniqueService);
    private readonly destroy$   = new Subject<void>();

    controlesTechniques: ControleTechnique[] = [];
    isLoading = true;

    // Form state
    showForm                  = false;
    controleTechniqueToEdit: ControleTechnique | null = null;

    // Detail state
    showDetail                        = false;
    selectedControleTechnique: ControleTechnique | null = null;

    // Delete state
    controleTechniqueToDelete: ControleTechnique | null = null;
    showDeleteConfirm = false;
    isDeleting        = false;

    StatutControleTechnique = StatutControleTechnique;

    ngOnInit(): void  { this.loadControlesTechniques(); }
    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

    loadControlesTechniques(): void {
        this.isLoading = true;
        this.ctService.findAllControlesTechniques()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next:  (items) => { this.controlesTechniques = items; this.isLoading = false; },
                error: ()      => { this.isLoading = false; },
            });
    }

    // ── Detail ─────────────────────────────────────────────────
    openDetail(ct: ControleTechnique): void {
        this.selectedControleTechnique = ct;
        this.showDetail = true;
    }
    closeDetail(): void {
        this.selectedControleTechnique = null;
        this.showDetail = false;
    }
    onEditFromDetail(ct: ControleTechnique): void {
        this.closeDetail();
        this.openEditForm(ct);
    }

    // ── Create ─────────────────────────────────────────────────
    openCreateForm(): void {
        this.controleTechniqueToEdit = null;
        this.showForm = true;
    }

    // ── Edit ───────────────────────────────────────────────────
    openEditForm(ct: ControleTechnique, event?: Event): void {
        event?.stopPropagation();
        this.controleTechniqueToEdit = ct;
        this.showForm = true;
    }
    closeForm(): void {
        this.showForm = false;
        this.controleTechniqueToEdit = null;
    }
    onControleTechniqueCreated(ct: ControleTechnique): void { this.closeForm(); this.loadControlesTechniques(); }
    onControleTechniqueUpdated(ct: ControleTechnique): void { this.closeForm(); this.loadControlesTechniques(); }

    // ── Delete ─────────────────────────────────────────────────
    openDeleteConfirm(ct: ControleTechnique, event: Event): void {
        event.stopPropagation();
        this.controleTechniqueToDelete = ct;
        this.showDeleteConfirm = true;
    }
    closeDeleteConfirm(): void {
        this.controleTechniqueToDelete = null;
        this.showDeleteConfirm = false;
        this.isDeleting = false;
    }
    confirmDelete(): void {
        if (!this.controleTechniqueToDelete) return;
        this.isDeleting = true;
        this.ctService.deleteControleTechnique(this.controleTechniqueToDelete.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next:  () => { this.closeDeleteConfirm(); this.loadControlesTechniques(); },
                error: (err: Error) => { console.error(err); this.isDeleting = false; },
            });
    }

    // ── Helpers ────────────────────────────────────────────────
    formatDate(date: Date | string | null): string {
        if (!date) return '—';
        try { return format(new Date(date), 'dd/MM/yyyy'); }
        catch { return '—'; }
    }

    getStatutConfig(statut: StatutControleTechnique): { label: string; classes: string } {
        const map: Record<StatutControleTechnique, { label: string; classes: string }> = {
            [StatutControleTechnique.BROUILLON]: { label: 'Draft',     classes: 'bg-amber-50 text-amber-600 border border-amber-100' },
            [StatutControleTechnique.VALIDE]:    { label: 'Validated', classes: 'bg-green-50 text-green-600 border border-green-100' },
            [StatutControleTechnique.ANNULE]:    { label: 'Cancelled', classes: 'bg-red-50 text-red-500 border border-red-100' },
        };
        return map[statut] ?? { label: statut, classes: 'bg-gray-100 text-gray-600' };
    }

    canEdit(ct: ControleTechnique): boolean   { return ct.statut === StatutControleTechnique.BROUILLON; }
    canDelete(ct: ControleTechnique): boolean { return ct.statut !== StatutControleTechnique.VALIDE; }

    getTotalMontant(): number {
        return this.controlesTechniques.reduce((sum, ct) => sum + Number(ct.montant), 0);
    }
}