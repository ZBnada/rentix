import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { Vignette, StatutVignette } from '../../models/vignette.model';

@Component({
    selector: 'app-vignette-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './vignette-detail.component.html',
})
export class VignetteDetailComponent {
    @Input({ required: true }) vignette!: Vignette;
    @Output() closed        = new EventEmitter<void>();
    @Output() editRequested = new EventEmitter<Vignette>();

    StatutVignette = StatutVignette;

    get canEdit(): boolean {
        return this.vignette.statut === StatutVignette.BROUILLON;
    }

    get progressPercent(): number {
        if (!this.vignette.montant || this.vignette.montant === 0) return 0;
        return Math.min(100, Math.round(
            ((this.vignette.montant - this.vignette.montantReste) / this.vignette.montant) * 100
        ));
    }

    formatDate(date: Date | string | null | undefined): string {
        if (!date) return '—';
        try { return format(new Date(date), 'dd/MM/yyyy'); }
        catch { return '—'; }
    }

    getStatutConfig(statut: StatutVignette): { label: string; dotClass: string; badgeClass: string } {
        const map: Record<StatutVignette, { label: string; dotClass: string; badgeClass: string }> = {
            [StatutVignette.BROUILLON]: { label: 'Draft',     dotClass: 'bg-amber-400', badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200' },
            [StatutVignette.VALIDE]:    { label: 'Validated', dotClass: 'bg-green-500', badgeClass: 'bg-green-50 text-green-600 border border-green-200' },
            [StatutVignette.ANNULE]:    { label: 'Cancelled', dotClass: 'bg-red-400',   badgeClass: 'bg-red-50 text-red-500 border border-red-200' },
        };
        return map[statut] ?? { label: statut, dotClass: 'bg-gray-400', badgeClass: 'bg-gray-100 text-gray-600' };
    }

    onEdit():  void { this.editRequested.emit(this.vignette); }
    onClose(): void { this.closed.emit(); }
}