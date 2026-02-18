import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssuranceListComponent } from '../../components/assurance-list/assurance-list.component';

/**
 * Page principale - Liste des assurances
 */
@Component({
    selector: 'app-assurance-index',
    standalone: true,
    imports: [CommonModule, AssuranceListComponent],
    template: `<app-assurance-list />`,
})
export class AssuranceIndexComponent {}