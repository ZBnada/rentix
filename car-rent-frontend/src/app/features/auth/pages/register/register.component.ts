import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RegisterTypeModalComponent } from '../../components/register-type-modal/register-type-modal.component';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { UserType } from '../../models/auth.types';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, RegisterTypeModalComponent, RegisterFormComponent],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);

    showTypeModal = signal(true);
    selectedUserType = signal<UserType | null>(null);

    ngOnInit(): void {
        // Vérifier si un type est passé en query param
        const typeParam = this.route.snapshot.queryParamMap.get('type');

        if (typeParam && (typeParam === UserType.INDIVIDUAL || typeParam === UserType.COMPANY)) {
            // Si le type est fourni, on l'utilise directement
            this.selectedUserType.set(typeParam as UserType);
            this.showTypeModal.set(false);
        } else {
            // Sinon, on affiche le modal de sélection
            this.showTypeModal.set(true);
        }
    }

    handleSelectUserType(type: UserType): void {
        this.selectedUserType.set(type);
        this.showTypeModal.set(false);
    }

    handleCloseModal(): void {
        this.showTypeModal.set(false);
    }
}