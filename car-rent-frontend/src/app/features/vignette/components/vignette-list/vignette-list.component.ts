import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { format } from 'date-fns';
import { VignetteService } from '../../services/vignette.service';
import { Vignette, StatutVignette } from '../../models/vignette.model';
import { VignetteFormComponent } from '../vignette-form/vignette-form.component';
import { VignetteDetailComponent } from '../vignette-detail/vignette-detail.component';

@Component({
    selector: 'app-vignette-list',
    standalone: true,
    imports: [CommonModule, VignetteFormComponent, VignetteDetailComponent],
    templateUrl: './vignette-list.component.html',
})
export class VignetteListComponent implements OnInit, OnDestroy {
    private readonly vignetteService = inject(VignetteService);
    private readonly destroy$        = new Subject<void>();

    vignettes: Vignette[] = [];
    isLoading = true;

    showForm      = false;
    vignetteToEdit: Vignette | null = null;

    showDetail        = false;
    selectedVignette: Vignette | null = null;

    vignetteToDelete: Vignette | null = null;
    showDeleteConfirm = false;
    isDeleting        = false;

    StatutVignette = StatutVignette;

    ngOnInit(): void  { this.loadVignettes(); }
    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

    loadVignettes(): void {
        this.isLoading = true;
        this.vignetteService.findAllVignettes()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next:  (v) => { this.vignettes = v; this.isLoading = false; },
                error: ()  => { this.isLoading = false; },
            });
    }

    openDetail(v: Vignette): void   { this.selectedVignette = v; this.showDetail = true; }
    closeDetail(): void             { this.selectedVignette = null; this.showDetail = false; }
    onEditFromDetail(v: Vignette): void { this.closeDetail(); this.openEditForm(v); }

    openCreateForm(): void          { this.vignetteToEdit = null; this.showForm = true; }
    openEditForm(v: Vignette, event?: Event): void {
        event?.stopPropagation();
        this.vignetteToEdit = v;
        this.showForm = true;
    }
    closeForm(): void               { this.showForm = false; this.vignetteToEdit = null; }
    onVignetteCreated(_v: Vignette): void { this.closeForm(); this.loadVignettes(); }
    onVignetteUpdated(_v: Vignette): void { this.closeForm(); this.loadVignettes(); }

    openDeleteConfirm(v: Vignette, event: Event): void {
        event.stopPropagation();
        this.vignetteToDelete = v;
        this.showDeleteConfirm = true;
    }
    closeDeleteConfirm(): void {
        this.vignetteToDelete = null;
        this.showDeleteConfirm = false;
        this.isDeleting = false;
    }
    confirmDelete(): void {
        if (!this.vignetteToDelete) return;
        this.isDeleting = true;
        this.vignetteService.deleteVignette(this.vignetteToDelete.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next:  () => { this.closeDeleteConfirm(); this.loadVignettes(); },
                error: (err: Error) => { console.error(err); this.isDeleting = false; },
            });
    }

    formatDate(date: Date | string | null): string {
        if (!date) return '—';
        try { return format(new Date(date), 'dd/MM/yyyy'); }
        catch { return '—'; }
    }

    getStatutConfig(statut: StatutVignette): { label: string; classes: string } {
        const map: Record<StatutVignette, { label: string; classes: string }> = {
            [StatutVignette.BROUILLON]: { label: 'Draft',     classes: 'bg-amber-50 text-amber-600 border border-amber-100' },
            [StatutVignette.VALIDE]:    { label: 'Validated', classes: 'bg-green-50 text-green-600 border border-green-100' },
            [StatutVignette.ANNULE]:    { label: 'Cancelled', classes: 'bg-red-50 text-red-500 border border-red-100' },
        };
        return map[statut] ?? { label: statut, classes: 'bg-gray-100 text-gray-600' };
    }

    canEdit(v: Vignette): boolean   { return v.statut === StatutVignette.BROUILLON; }
    canDelete(v: Vignette): boolean { return v.statut !== StatutVignette.VALIDE; }
    getTotalMontant(): number { return this.vignettes.reduce((s, v) => s + Number(v.montant), 0); }
}