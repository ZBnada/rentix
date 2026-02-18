import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationEntretiensComponent } from '../../components/configuration-entretiens/configuration-entretiens.component';

@Component({
    selector: 'app-entretien-a-suivre-page',
    standalone: true,
    imports: [CommonModule, ConfigurationEntretiensComponent],
    templateUrl: './entretien-a-suivre-page.component.html',
    styleUrls: ['./entretien-a-suivre-page.component.css'],
})
export class EntretienASuivrePageComponent {
    valider(): void {
        console.log('✅ Configuration validated');
        // Validation logic if needed
    }
}