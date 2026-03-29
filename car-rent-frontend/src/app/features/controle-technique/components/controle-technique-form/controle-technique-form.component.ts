import {
    Component, OnInit, OnDestroy,
    Output, Input, EventEmitter, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule, FormBuilder, FormGroup,
    FormArray, Validators, AbstractControl,
} from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { format } from 'date-fns';
import { ControleTechniqueService } from '../../services/controle-technique.service';
import {
    ControleTechnique, Vehicule, ModePaiement,
    CreateControleTechniqueInput, UpdateControleTechniqueInput,
} from '../../models/controle-technique.model';

@Component({
    selector: 'app-controle-technique-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './controle-technique-form.component.html',
})
export class ControleTechniqueFormComponent implements OnInit, OnDestroy {
    @Input() controleTechniqueToEdit: ControleTechnique | null = null;

    @Output() controleTechniqueCreated = new EventEmitter<ControleTechnique>();
    @Output() controleTechniqueUpdated = new EventEmitter<ControleTechnique>();
    @Output() formClosed                = new EventEmitter<void>();

    private readonly fb        = inject(FormBuilder);
    private readonly ctService = inject(ControleTechniqueService);
    private readonly destroy$  = new Subject<void>();

    form!: FormGroup;
    vehicules:     Vehicule[]     = [];
    modesPaiement: ModePaiement[] = [];
    isLoading     = false;
    isDataLoading = true;
    loadError: string | null = null;
    today = format(new Date(), 'yyyy-MM-dd');

    get isEditMode(): boolean { return !!this.controleTechniqueToEdit; }
    get ficheNumber(): number { return this.controleTechniqueToEdit?.numeroFiche ?? 0; }
    get modalTitle(): string {
        return this.isEditMode
            ? `Edit Inspection #${this.controleTechniqueToEdit!.numeroFiche}`
            : 'New Technical Inspection';
    }

    ngOnInit(): void { this.buildForm(); this.loadData(); }

    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

    private buildForm(): void {
        this.form = this.fb.group({
            vehiculeId:      ['', Validators.required],
            dateFinValidite: ['', Validators.required],
            montant:         [0, [Validators.required, Validators.min(0)]],
            dateOperation:   [this.today, Validators.required],
            saisiPar:        [''],
            modifiePar:      [''],
            lignesReglement: this.fb.array([]),
        });
    }

    private loadData(): void {
        this.isDataLoading = true;
        this.loadError     = null;
        forkJoin({
            vehicules:     this.ctService.findAllVehicules(),
            modesPaiement: this.ctService.findAllModesPaiement(),
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ vehicules, modesPaiement }) => {
                    this.vehicules     = vehicules;
                    this.modesPaiement = modesPaiement;
                    this.isDataLoading = false;
                    if (this.isEditMode) this.populateForm(this.controleTechniqueToEdit!);
                },
                error: (err: Error) => {
                    console.error(err);
                    this.loadError     = 'Unable to load data. Please check the GraphQL connection.';
                    this.isDataLoading = false;
                },
            });
    }

    private populateForm(ct: ControleTechnique): void {
        this.form.patchValue({
            vehiculeId:      ct.vehiculeId,
            dateFinValidite: this.formatDateForInput(ct.dateFinValidite),
            montant:         ct.montant,
            dateOperation:   this.formatDateForInput(ct.dateOperation),
            saisiPar:        ct.saisiPar  ?? '',
            modifiePar:      ct.modifiePar ?? '',
        });
        this.lignesArray.clear();
        ct.lignesReglement?.forEach((ligne) => {
            this.lignesArray.push(this.fb.group({
                modePaiementId: [ligne.modePaiementId, Validators.required],
                designation:    [ligne.designation    ?? ''],
                montant:        [ligne.montant,  [Validators.required, Validators.min(0.001)]],
                echeance:       [this.formatDateForInput(ligne.echeance)],
                referencePiece: [ligne.referencePiece ?? ''],
                banque:         [ligne.banque          ?? ''],
                porteur:        [ligne.porteur         ?? ''],
                dateOperation:  [this.formatDateForInput(ligne.dateOperation), Validators.required],
            }));
        });
    }

    private formatDateForInput(date: Date | string | undefined | null): string {
        if (!date) return '';
        try { return format(new Date(date), 'yyyy-MM-dd'); }
        catch { return ''; }
    }

    retryLoadData(): void { this.loadData(); }

    get lignesArray(): FormArray { return this.form.get('lignesReglement') as FormArray; }
    get montantTotal(): number   { return Number(this.form.get('montant')?.value) || 0; }
    get montantRegle(): number   { return this.lignesArray.controls.reduce((s, c) => s + (Number(c.get('montant')?.value) || 0), 0); }
    get montantReste(): number   { return Math.max(0, this.montantTotal - this.montantRegle); }

    addLigne(): void {
        this.lignesArray.push(this.fb.group({
            modePaiementId: ['',    Validators.required],
            designation:    [''],
            montant:        [0,     [Validators.required, Validators.min(0.001)]],
            echeance:       [''],
            referencePiece: [''],
            banque:         [''],
            porteur:        [''],
            dateOperation:  [this.today, Validators.required],
        }));
    }

    removeLigne(index: number): void { this.lignesArray.removeAt(index); }

    getLigneControl(index: number, field: string): AbstractControl {
        return this.lignesArray.at(index).get(field)!;
    }

    onSubmit(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.isLoading = true;
        const raw = this.form.value;

        const lignes = raw.lignesReglement.map((l: any) => ({
            modePaiementId: l.modePaiementId,
            designation:    l.designation    || undefined,
            montant:        Number(l.montant),
            echeance:       l.echeance       || undefined,
            referencePiece: l.referencePiece || undefined,
            banque:         l.banque         || undefined,
            porteur:        l.porteur        || undefined,
            dateOperation:  l.dateOperation,
        }));

        if (this.isEditMode) {
            const input: UpdateControleTechniqueInput = {
                id: this.controleTechniqueToEdit!.id,
                vehiculeId: raw.vehiculeId, dateFinValidite: raw.dateFinValidite,
                montant: Number(raw.montant), dateOperation: raw.dateOperation,
                modifiePar: raw.modifiePar || undefined, lignesReglement: lignes,
            };
            this.ctService.updateControleTechnique(input).pipe(takeUntil(this.destroy$)).subscribe({
                next:  (ct) => { this.isLoading = false; this.controleTechniqueUpdated.emit(ct); },
                error: (err: Error) => { console.error(err); this.isLoading = false; },
            });
        } else {
            const input: CreateControleTechniqueInput = {
                vehiculeId: raw.vehiculeId, dateFinValidite: raw.dateFinValidite,
                montant: Number(raw.montant), dateOperation: raw.dateOperation,
                saisiPar: raw.saisiPar || undefined, lignesReglement: lignes,
            };
            this.ctService.createControleTechnique(input).pipe(takeUntil(this.destroy$)).subscribe({
                next:  (ct) => { this.isLoading = false; this.controleTechniqueCreated.emit(ct); },
                error: (err: Error) => { console.error(err); this.isLoading = false; },
            });
        }
    }

    onCancel(): void { this.formClosed.emit(); }
}