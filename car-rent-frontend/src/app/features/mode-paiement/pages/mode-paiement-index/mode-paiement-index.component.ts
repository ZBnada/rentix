import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModePaiementListComponent } from '../../components/mode-paiement-list/mode-paiement-list.component';

/**
 * Page principale - Liste des modes de paiement
 */
@Component({
    selector: 'app-mode-paiement-index',
    standalone: true,
    imports: [CommonModule, ModePaiementListComponent],
    template: `<app-mode-paiement-list />`,
})
export class ModePaiementIndexComponent {}