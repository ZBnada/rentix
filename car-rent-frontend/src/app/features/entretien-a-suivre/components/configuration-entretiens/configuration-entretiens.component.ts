import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { EntretienASuivreService } from '../../services/entretien-a-suivre.service';
import { LigneTableauEntretiens } from '../../models/entretien-a-suivre.models';
import { TypeEntretien } from '../../../type-entretien/models/type-entretien.model';

@Component({
    selector: 'app-configuration-entretiens',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './configuration-entretiens.component.html',
    styleUrls: ['./configuration-entretiens.component.css'],
})
export class ConfigurationEntretiensComponent implements OnInit {
    lignesTableau: LigneTableauEntretiens[] = [];
    typesEntretien: TypeEntretien[] = [];
    isLoading = false;
    errorMessage = '';

    constructor(private entretienASuivreService: EntretienASuivreService) {}

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.entretienASuivreService.getAllTypesEntretien().subscribe({
            next: (types) => {
                this.typesEntretien = types;

                this.entretienASuivreService.getAllConfigurationsEntretiens().subscribe({
                    next: (lignes) => {
                        this.lignesTableau = lignes;
                        this.isLoading = false;
                    },
                    error: (error) => {
                        console.error('❌ Error loading configurations:', error);
                        this.errorMessage = 'Error loading configurations';
                        this.isLoading = false;
                    },
                });
            },
            error: (error) => {
                console.error('❌ Error loading maintenance types:', error);
                this.errorMessage = 'Error loading maintenance types';
                this.isLoading = false;
            },
        });
    }

    onToggleEntretien(
        vehiculeId: string,
        typeEntretienId: string,
        estActive: boolean
    ): void {
        const newState = !estActive;

        this.entretienASuivreService
            .toggleEntretien(vehiculeId, typeEntretienId, newState)
            .subscribe({
                next: () => {
                    const ligne = this.lignesTableau.find(
                        (l) => l.vehicule.id === vehiculeId
                    );
                    if (ligne) {
                        const typeEntretien = this.typesEntretien.find(
                            (t) => t.id === typeEntretienId
                        );
                        if (typeEntretien) {
                            ligne.entretiensParCode.set(
                                typeEntretien.codeEntretien,
                                newState
                            );

                            if (newState) {
                                Swal.fire({
                                    title: 'Maintenance added!',
                                    html: `Maintenance <strong>${typeEntretien.codeEntretien}</strong> has been added to the logbook for vehicle <strong>${ligne.vehicule.matricule}</strong>.`,
                                    icon: 'success',
                                    confirmButtonText: 'OK',
                                    customClass: {
                                        popup: 'rentix-popup',
                                        title: 'rentix-title',
                                        confirmButton: 'rentix-confirm-btn',
                                    },
                                    buttonsStyling: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                });
                            } else {
                                Swal.fire({
                                    title: 'Maintenance removed',
                                    html: `Maintenance <strong>${typeEntretien.codeEntretien}</strong> has been removed for vehicle <strong>${ligne.vehicule.matricule}</strong>.`,
                                    icon: 'info',
                                    confirmButtonText: 'OK',
                                    customClass: {
                                        popup: 'rentix-popup',
                                        title: 'rentix-title',
                                        confirmButton: 'rentix-confirm-btn',
                                    },
                                    buttonsStyling: false,
                                    timer: 2000,
                                    timerProgressBar: true,
                                });
                            }
                        }
                    }
                },
                error: (error) => {
                    console.error('❌ Error toggling maintenance:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Unable to update the maintenance.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'rentix-popup',
                            title: 'rentix-title',
                            confirmButton: 'rentix-confirm-btn',
                        },
                        buttonsStyling: false,
                    });
                },
            });
    }

    isEntretienActive(ligne: LigneTableauEntretiens, codeEntretien: string): boolean {
        return ligne.entretiensParCode.get(codeEntretien) ?? false;
    }

    getTypeEntretienId(codeEntretien: string): string {
        return (
            this.typesEntretien.find((t) => t.codeEntretien === codeEntretien)?.id ?? ''
        );
    }

    getTotalActive(): number {
        let count = 0;
        this.lignesTableau.forEach(ligne => {
            this.typesEntretien.forEach(type => {
                if (this.isEntretienActive(ligne, type.codeEntretien)) count++;
            });
        });
        return count;
    }

    valider(): void {
        Swal.fire({
            title: 'Configuration saved!',
            text: 'The maintenance tracking has been configured successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'rentix-popup',
                title: 'rentix-title',
                confirmButton: 'rentix-confirm-btn',
            },
            buttonsStyling: false,
            timer: 3000,
        });
    }
}