import {
    Component, OnInit, OnDestroy, Input, Output, EventEmitter, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators
} from '@angular/forms';
import { Subject, takeUntil, forkJoin, first } from 'rxjs';
import { format } from 'date-fns';
import { AssuranceService, Assurance, CreateAssuranceDto, UpdateAssuranceDto } from '../../services/assurance.service';
import { ModePaiementService } from '../../../mode-paiement/services/mode-paiement.service';
import { VehicleService } from '../../../vehicule/services/vehicle.service';

@Component({
    selector: 'app-assurance-form-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './assurance-form-modal.component.html',
})
export class AssuranceFormModalComponent implements OnInit, OnDestroy {
    @Input() assuranceToEdit: Assurance | null = null;

    @Output() assuranceCreated = new EventEmitter<Assurance>();
    @Output() assuranceUpdated = new EventEmitter<Assurance>();
    @Output() formClosed = new EventEmitter<void>();

    private readonly fb = inject(FormBuilder);
    private readonly assuranceService = inject(AssuranceService);
    private readonly modePaiementService = inject(ModePaiementService);
    private readonly vehicleService = inject(VehicleService);
    private readonly destroy$ = new Subject<void>();

    form!: FormGroup;
    vehicules: any[] = [];
    modesPaiement: any[] = [];
    isLoading = false;
    isDataLoading = true;
    loadError: string | null = null;
    today = format(new Date(), 'yyyy-MM-dd');

    get isEditMode(): boolean {
        return !!this.assuranceToEdit;
    }

    get modalTitle(): string {
        return this.isEditMode
            ? `Modifier l'assurance - ${this.assuranceToEdit!.prestataire}`
            : 'Nouvelle assurance';
    }

    ngOnInit(): void {
        this.buildForm();
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private buildForm(): void {
        this.form = this.fb.group({
            vehiculeId: ['', Validators.required],
            prestataire: ['', Validators.required],
            numeroPolice: [''],
            dateDebut: ['', Validators.required],
            dateFinValidite: ['', Validators.required],
            montantTotal: [0, [Validators.required, Validators.min(0)]],
            dateOperation: [this.today, Validators.required],
            observations: [''],
            saisiPar: [''],
            modifiePar: [''],
            reglements: this.fb.array([]),
        });
    }

    private loadData(): void {
        this.isDataLoading = true;
        this.loadError = null;

        forkJoin({
            modesPaiement: this.modePaiementService.findAllModesPaiement(),
            // first() — prend la première valeur et ferme le stream
            // nécessaire car getAllVehicles() utilise watchQuery (stream infini)
            // sans first(), forkJoin attend indéfiniment → "Loading data..."
            vehicules: this.vehicleService.getAllVehicles().pipe(first()),
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ modesPaiement, vehicules }) => {
                    this.modesPaiement = modesPaiement;

                    // Mapper VehicleModel → format attendu par le template
                    this.vehicules = vehicules.map(v => ({
                        id: v.id,                      // UUID réel depuis DB ✓
                        immatriculation: v.registrationNumber,
                        marque: v.brand?.label ?? '',
                        modele: v.type ?? '',
                    }));

                    this.isDataLoading = false;

                    if (this.isEditMode) {
                        this.populateForm(this.assuranceToEdit!);
                    }
                },
                error: (err) => {
                    console.error('❌ Erreur chargement données:', err);
                    this.loadError = 'Impossible de charger les données.';
                    this.isDataLoading = false;
                },
            });
    }

    private populateForm(assurance: Assurance): void {
        this.form.patchValue({
            vehiculeId: assurance.vehiculeId,
            prestataire: assurance.prestataire,
            numeroPolice: assurance.numeroPolice,
            dateDebut: this.formatDateForInput(assurance.dateDebut),
            dateFinValidite: this.formatDateForInput(assurance.dateFinValidite),
            montantTotal: assurance.montantTotal,
            dateOperation: this.formatDateForInput(assurance.dateOperation),
            observations: assurance.observations,
            saisiPar: assurance.saisiPar ?? '',
            modifiePar: assurance.modifiePar ?? '',
        });

        this.reglementsArray.clear();
        assurance.reglements?.forEach((reglement) => {
            const reglementGroup = this.fb.group({
                modePaiementId: [reglement.modePaiementId, Validators.required],
                designation: [reglement.designation ?? ''],
                montant: [reglement.montant, [Validators.required, Validators.min(0.001)]],
                echeance: [this.formatDateForInput(reglement.echeance)],
                referencePiece: [reglement.referencePiece ?? ''],
                banque: [reglement.banque ?? ''],
                porteur: [reglement.porteur ?? ''],
                dateOperation: [this.formatDateForInput(reglement.dateOperation), Validators.required],
            });
            this.reglementsArray.push(reglementGroup);
        });
    }

    private formatDateForInput(date: Date | string | undefined | null): string {
        if (!date) return '';
        try {
            return format(new Date(date), 'yyyy-MM-dd');
        } catch {
            return '';
        }
    }

    retryLoadData(): void {
        this.loadData();
    }

    get reglementsArray(): FormArray {
        return this.form.get('reglements') as FormArray;
    }

    get montantTotal(): number {
        return Number(this.form.get('montantTotal')?.value) || 0;
    }

    get montantRegle(): number {
        return this.reglementsArray.controls.reduce(
            (sum, ctrl) => sum + (Number(ctrl.get('montant')?.value) || 0), 0
        );
    }

    get montantReste(): number {
        return Math.max(0, this.montantTotal - this.montantRegle);
    }

    addReglement(): void {
        const reglementGroup = this.fb.group({
            modePaiementId: ['', Validators.required],
            designation: [''],
            montant: [0, [Validators.required, Validators.min(0.001)]],
            echeance: [''],
            referencePiece: [''],
            banque: [''],
            porteur: [''],
            dateOperation: [this.today, Validators.required],
        });
        this.reglementsArray.push(reglementGroup);
    }

    removeReglement(index: number): void {
        this.reglementsArray.removeAt(index);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const raw = this.form.value;

        const reglements = raw.reglements.map((r: any) => ({
            modePaiementId: r.modePaiementId,
            designation: r.designation || undefined,
            montant: Number(r.montant),
            echeance: r.echeance || undefined,
            referencePiece: r.referencePiece || undefined,
            banque: r.banque || undefined,
            porteur: r.porteur || undefined,
            dateOperation: r.dateOperation,
        }));

        if (this.isEditMode) {
            const updateInput: UpdateAssuranceDto = {
                id: this.assuranceToEdit!.id,
                vehiculeId: raw.vehiculeId,
                prestataire: raw.prestataire,
                numeroPolice: raw.numeroPolice,
                dateDebut: raw.dateDebut,
                dateFinValidite: raw.dateFinValidite,
                montantTotal: Number(raw.montantTotal),
                dateOperation: raw.dateOperation,
                observations: raw.observations,
                modifiePar: raw.modifiePar || undefined,
                reglements: reglements,
            };

            this.assuranceService.updateAssurance(updateInput)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (assurance) => {
                        this.isLoading = false;
                        this.assuranceUpdated.emit(assurance);
                    },
                    error: (err) => {
                        console.error('❌ Erreur update:', err);
                        this.isLoading = false;
                    },
                });
        } else {
            const createInput: CreateAssuranceDto = {
                vehiculeId: raw.vehiculeId,
                prestataire: raw.prestataire,
                numeroPolice: raw.numeroPolice,
                dateDebut: raw.dateDebut,
                dateFinValidite: raw.dateFinValidite,
                montantTotal: Number(raw.montantTotal),
                dateOperation: raw.dateOperation,
                observations: raw.observations,
                saisiPar: raw.saisiPar || undefined,
                reglements: reglements,
            };

            this.assuranceService.createAssurance(createInput)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (assurance) => {
                        this.isLoading = false;
                        this.assuranceCreated.emit(assurance);
                    },
                    error: (err) => {
                        console.error('❌ Erreur create:', err);
                        this.isLoading = false;
                    },
                });
        }
    }

    onCancel(): void {
        this.formClosed.emit();
    }
}