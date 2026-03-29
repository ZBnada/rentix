import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AssuranceUtils } from '../../models/assurance-config.model';
import { AssuranceService, Assurance } from '../../services/assurance.service';

@Component({
    selector: 'app-assurance-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './assurance-detail.component.html',
})
export class AssuranceDetailComponent implements OnInit {
    assurance = signal<Assurance | null>(null);
    isLoading = signal<boolean>(true);
    AssuranceUtils = AssuranceUtils;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private assuranceService: AssuranceService,
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.loadAssurance(id);
    }

    loadAssurance(id: string): void {
        this.isLoading.set(true);
        this.assuranceService.findAssuranceById(id).subscribe({
            next:  (data) => { this.assurance.set(data); this.isLoading.set(false); },
            error: (err)  => {
                console.error(err);
                this.isLoading.set(false);
                this.showError('Unable to load insurance contract');
                this.router.navigate(['/dashboard/assurances']);
            },
        });
    }

    async deleteAssurance(): Promise<void> {
        const assur = this.assurance();
        if (!assur) return;
        const result = await Swal.fire({
            title: 'Confirm Deletion',
            html: `Are you sure you want to delete the insurance from <strong>${assur.prestataire}</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            customClass: { popup: 'rentix-popup', title: 'rentix-title', confirmButton: 'rentix-confirm-btn', cancelButton: 'rentix-cancel-btn' },
            buttonsStyling: false,
        });
        if (result.isConfirmed) {
            this.assuranceService.deleteAssurance(assur.id).subscribe({
                next:  () => { this.showSuccess('Insurance deleted successfully'); this.router.navigate(['/dashboard/assurances']); },
                error: (err) => { console.error(err); this.showError('Error deleting insurance'); },
            });
        }
    }

    downloadDocument(): void {
        const assur = this.assurance();
        if (assur?.documentUrl) window.open(assur.documentUrl, '_blank');
    }

    private showSuccess(message: string): void {
        Swal.fire({ title: 'Success', text: message, icon: 'success', timer: 3000, showConfirmButton: false,
            customClass: { popup: 'rentix-popup', title: 'rentix-title' } });
    }
    private showError(message: string): void {
        Swal.fire({ title: 'Error', text: message, icon: 'error', confirmButtonText: 'OK',
            customClass: { popup: 'rentix-popup', title: 'rentix-title', confirmButton: 'rentix-confirm-btn' }, buttonsStyling: false });
    }
}
