import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { format } from 'date-fns';
import { VignetteService } from '../../services/vignette.service';
import { Vignette, Vehicule, ModePaiement, CreateVignetteInput, UpdateVignetteInput } from '../../models/vignette.model';

@Component({
    selector: 'app-vignette-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './vignette-form.component.html',
})
export class VignetteFormComponent implements OnInit, OnDestroy {
    @Input() vignetteToEdit: Vignette | null = null;
    @Output() vignetteCreated = new EventEmitter<Vignette>();
    @Output() vignetteUpdated = new EventEmitter<Vignette>();
    @Output() formClosed      = new EventEmitter<void>();

    private readonly fb             = inject(FormBuilder);
    private readonly vignetteService = inject(VignetteService);
    private readonly destroy$       = new Subject<void>();

    form!: FormGroup;
    vehicules:     Vehicule[]     = [];
    modesPaiement: ModePaiement[] = [];
    isLoading     = false;
    isDataLoading = true;
    loadError: string | null = null;
    today = format(new Date(), 'yyyy-MM-dd');

    get isEditMode(): boolean { return !!this.vignetteToEdit; }
    get ficheNumber(): number { return this.vignetteToEdit?.numeroFiche ?? 0; }
    get modalTitle(): string {
        return this.isEditMode
            ? `Edit Sticker #${this.vignetteToEdit!.numeroFiche}`
            : 'New Vehicle Sticker';
    }

    ngOnInit(): void  { this.buildForm(); this.loadData(); }
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
        this.loadError = null;
        forkJoin({
            vehicules:     this.vignetteService.findAllVehicules(),
            modesPaiement: this.vignetteService.findAllModesPaiement(),
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ vehicules, modesPaiement }) => {
                    this.vehicules     = vehicules;
                    this.modesPaiement = modesPaiement;
                    this.isDataLoading = false;
                    if (this.isEditMode) this.populateForm(this.vignetteToEdit!);
                },
                error: (err) => {
                    console.error(err);
                    this.loadError     = 'Unable to load data. Please check the GraphQL connection.';
                    this.isDataLoading = false;
                },
            });
    }

    private populateForm(v: Vignette): void {
        this.form.patchValue({
            vehiculeId:      v.vehiculeId,
            dateFinValidite: this.fmt(v.dateFinValidite),
            montant:         v.montant,
            dateOperation:   this.fmt(v.dateOperation),
            saisiPar:        v.saisiPar  ?? '',
            modifiePar:      v.modifiePar ?? '',
        });
        this.lignesArray.clear();
        v.lignesReglement?.forEach((l) => {
            this.lignesArray.push(this.fb.group({
                modePaiementId: [l.modePaiementId, Validators.required],
                designation:    [l.designation    ?? ''],
                montant:        [l.montant,  [Validators.required, Validators.min(0.001)]],
                echeance:       [this.fmt(l.echeance)],
                referencePiece: [l.referencePiece ?? ''],
                banque:         [l.banque          ?? ''],
                porteur:        [l.porteur         ?? ''],
                dateOperation:  [this.fmt(l.dateOperation), Validators.required],
            }));
        });
    }

    private fmt(date: Date | string | undefined | null): string {
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
    getLigneControl(index: number, field: string): AbstractControl { return this.lignesArray.at(index).get(field)!; }

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
            const input: UpdateVignetteInput = {
                id: this.vignetteToEdit!.id,
                vehiculeId: raw.vehiculeId, dateFinValidite: raw.dateFinValidite,
                montant: Number(raw.montant), dateOperation: raw.dateOperation,
                modifiePar: raw.modifiePar || undefined, lignesReglement: lignes,
            };
            this.vignetteService.updateVignette(input).pipe(takeUntil(this.destroy$)).subscribe({
                next:  (v) => { this.isLoading = false; this.vignetteUpdated.emit(v); },
                error: (err) => { console.error(err); this.isLoading = false; },
            });
        } else {
            const input: CreateVignetteInput = {
                vehiculeId: raw.vehiculeId, dateFinValidite: raw.dateFinValidite,
                montant: Number(raw.montant), dateOperation: raw.dateOperation,
                saisiPar: raw.saisiPar || undefined, lignesReglement: lignes,
            };
            this.vignetteService.createVignette(input).pipe(takeUntil(this.destroy$)).subscribe({
                next:  (v) => { this.isLoading = false; this.vignetteCreated.emit(v); },
                error: (err) => { console.error(err); this.isLoading = false; },
            });
        }
    }

    onCancel(): void { this.formClosed.emit(); }
}