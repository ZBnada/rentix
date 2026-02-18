import { Component, OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { AssuranceFormBuilder } from '../../config/assurance-form.config';

/**
 * Interface pour un règlement
 */
export interface ReglementFormData {
    modePaiementId: string;
    designation?: string;
    montant: number;
    dateOperation: Date;
    echeance?: Date;
    referencePiece?: string;
    banque?: string;
    porteur?: string;
}

/**
 * Composant pour gérer les règlements d'une assurance
 */
@Component({
    selector: 'app-assurance-reglement-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './assurance-reglement-form.component.html',
})
export class AssuranceReglementFormComponent implements OnInit {
    @Input() parentForm!: FormGroup;
    @Input() modesPaiement: any[] = [];
    @Input() montantTotal: number = 0;

    totalReglements = signal<number>(0);

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        if (!this.parentForm.get('reglements')) {
            this.parentForm.addControl('reglements', this.formBuilder.array([]));
        }
        this.calculateTotal();
    }

    /**
     * Obtenir le FormArray des règlements
     */
    get reglements(): FormArray {
        return this.parentForm.get('reglements') as FormArray;
    }

    /**
     * Ajouter un règlement
     */
    addReglement(): void {
        const controls = AssuranceFormBuilder.buildReglementFormControls();
        const reglementGroup = this.formBuilder.group(controls);
        this.reglements.push(reglementGroup);
    }

    /**
     * Supprimer un règlement
     */
    removeReglement(index: number): void {
        this.reglements.removeAt(index);
        this.calculateTotal();
    }

    /**
     * Calculer le total des règlements
     */
    calculateTotal(): void {
        const total = this.reglements.controls.reduce((sum, control) => {
            const montant = parseFloat(control.get('montant')?.value || 0);
            return sum + montant;
        }, 0);
        this.totalReglements.set(total);
    }

    /**
     * Vérifier si le total est équilibré
     */
    isBalanced(): boolean {
        return Math.abs(this.totalReglements() - this.montantTotal) < 0.01;
    }

    /**
     * Obtenir les classes CSS pour un champ
     */
    getFieldClasses(control: any): string {
        const baseClasses = 'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors';
        const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500';
        const successClasses = 'border-gray-300 focus:ring-orange-500 focus:border-orange-500';

        return `${baseClasses} ${control.invalid && control.touched ? errorClasses : successClasses}`;
    }
}