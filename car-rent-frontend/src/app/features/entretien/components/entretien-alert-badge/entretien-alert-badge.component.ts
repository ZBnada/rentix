// src/app/features/entretien/components/entretien-alert-badge/entretien-alert-badge.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entretien } from '../../models/entretien.model';
import {
    EntretienAlertService,
    EntretienAlert,
    EntretienAlertType
} from '../../services/entretien-alert.service';

/**
 * Composant Badge d'Alerte pour les Entretiens
 * Affiche un badge coloré avec le statut de l'entretien
 */
@Component({
    selector: 'app-entretien-alert-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './entretien-alert-badge.component.html',
    styleUrls: ['./entretien-alert-badge.component.css']
})
export class EntretienAlertBadgeComponent implements OnInit {
    @Input() entretien!: Entretien;
    @Input() showDaysCount = false;

    alert: EntretienAlert | null = null;
    alertTypes = EntretienAlertType;

    constructor(private alertService: EntretienAlertService) {}

    ngOnInit(): void {
        if (this.entretien) {
            this.alert = this.alertService.calculateAlert(this.entretien);
        }
    }
}