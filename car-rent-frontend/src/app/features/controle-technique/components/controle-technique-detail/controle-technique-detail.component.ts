import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { ControleTechnique, StatutControleTechnique } from '../../models/controle-technique.model';

@Component({
    selector: 'app-controle-technique-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './controle-technique-detail.component.html',
})
export class ControleTechniqueDetailComponent {
    @Input({ required: true }) controleTechnique!: ControleTechnique;
    @Output() closed        = new EventEmitter<void>();
    @Output() editRequested = new EventEmitter<ControleTechnique>();

    StatutControleTechnique = StatutControleTechnique;

    get canEdit(): boolean {
        return this.controleTechnique.statut === StatutControleTechnique.BROUILLON;
    }

    get progressPercent(): number {
        if (!this.controleTechnique.montant || this.controleTechnique.montant === 0) return 0;
        return Math.min(100, Math.round(
            ((this.controleTechnique.montant - this.controleTechnique.montantReste) / this.controleTechnique.montant) * 100
        ));
    }

    formatDate(date: Date | string | null | undefined): string {
        if (!date) return '—';
        try { return format(new Date(date), 'dd/MM/yyyy'); }
        catch { return '—'; }
    }

    getStatutConfig(statut: StatutControleTechnique): { label: string; dotClass: string; badgeClass: string } {
        const map: Record<StatutControleTechnique, { label: string; dotClass: string; badgeClass: string }> = {
            [StatutControleTechnique.BROUILLON]: {
                label: 'Draft',     dotClass: 'bg-amber-400',
                badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200',
            },
            [StatutControleTechnique.VALIDE]: {
                label: 'Validated', dotClass: 'bg-green-500',
                badgeClass: 'bg-green-50 text-green-600 border border-green-200',
            },
            [StatutControleTechnique.ANNULE]: {
                label: 'Cancelled', dotClass: 'bg-red-400',
                badgeClass: 'bg-red-50 text-red-500 border border-red-200',
            },
        };
        return map[statut] ?? { label: statut, dotClass: 'bg-gray-400', badgeClass: 'bg-gray-100 text-gray-600' };
    }

    onEdit():  void { this.editRequested.emit(this.controleTechnique); }
    onClose(): void { this.closed.emit(); }
}