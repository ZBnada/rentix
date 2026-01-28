import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
    VehicleModel,
    CreateVehicleDto,
    UpdateVehicleDto,
    EnergyType,
    VehicleClass
} from '../models/vehicle.model';

/**
 * Vehicle Service
 * Handles all GraphQL operations for vehicles
 */
@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    constructor(private readonly apollo: Apollo) {}

    /**
     * GraphQL Queries
     */
    private readonly GET_ALL_VEHICLES = gql`
        query GetAllVehicles {
            vehicules {
                id
                matricule
                marqueId
                marque {
                    id
                    libelle
                    logoUrl
                }
                type
                datePremiereMiseEnCirculation
                puissance
                energie
                compteur
                couleur
                prixAchat
                classeVehicule
                prixLocationJournee
                prixHeureRetard
                roueSecours
                cricManivelle
                jeuHousse
                siegeBebe
                jeuTapis
                posteRadio
                jeuEnjoliveurs
                observations
                imageUrl
                saisiPar
                modifiePar
                saisiLe
                modifieLe
                estActif
            }
        }
    `;

    private readonly GET_VEHICLE_BY_ID = gql`
        query GetVehicleById($id: String!) {
            vehicule(id: $id) {
                id
                matricule
                marqueId
                marque {
                    id
                    libelle
                    logoUrl
                    description
                }
                type
                datePremiereMiseEnCirculation
                puissance
                energie
                compteur
                couleur
                prixAchat
                classeVehicule
                prixLocationJournee
                prixHeureRetard
                roueSecours
                cricManivelle
                jeuHousse
                siegeBebe
                jeuTapis
                posteRadio
                jeuEnjoliveurs
                observations
                imageUrl
                saisiPar
                modifiePar
                saisiLe
                modifieLe
                estActif
            }
        }
    `;

    private readonly GET_VEHICLES_BY_BRAND = gql`
        query GetVehiclesByBrand($brandId: String!) {
            vehiculesByMarque(marqueId: $brandId) {
                id
                matricule
                marque {
                    id
                    libelle
                }
                type
                energie
                classeVehicule
                prixLocationJournee
                estActif
            }
        }
    `;

    /**
     * GraphQL Mutations
     */
    private readonly CREATE_VEHICLE = gql`
        mutation CreateVehicle($input: CreateVehiculeInput!) {
            createVehicule(input: $input) {
                id
                matricule
                marqueId
                marque {
                    id
                    libelle
                    logoUrl
                }
                type
                datePremiereMiseEnCirculation
                puissance
                energie
                compteur
                couleur
                prixAchat
                classeVehicule
                prixLocationJournee
                prixHeureRetard
                roueSecours
                cricManivelle
                jeuHousse
                siegeBebe
                jeuTapis
                posteRadio
                jeuEnjoliveurs
                observations
                imageUrl
                estActif
            }
        }
    `;

    private readonly UPDATE_VEHICLE = gql`
        mutation UpdateVehicle($input: UpdateVehiculeInput!) {
            updateVehicule(input: $input) {
                id
                matricule
                marqueId
                marque {
                    id
                    libelle
                    logoUrl
                }
                type
                datePremiereMiseEnCirculation
                puissance
                energie
                compteur
                couleur
                prixAchat
                classeVehicule
                prixLocationJournee
                prixHeureRetard
                roueSecours
                cricManivelle
                jeuHousse
                siegeBebe
                jeuTapis
                posteRadio
                jeuEnjoliveurs
                observations
                imageUrl
                estActif
            }
        }
    `;

    private readonly DELETE_VEHICLE = gql`
        mutation DeleteVehicle($id: String!) {
            deleteVehicule(id: $id)
        }
    `;

    /**
     * Get all active vehicles
     */
    getAllVehicles(): Observable<VehicleModel[]> {
        return this.apollo
            .watchQuery<{ vehicules: any[] }>({
                query: this.GET_ALL_VEHICLES,
            })
            .valueChanges.pipe(
                map(result =>
                    result.data.vehicules.map(vehicle => this.mapToVehicleModel(vehicle))
                )
            );
    }

    /**
     * Get vehicle by ID
     */
    getVehicleById(id: string): Observable<VehicleModel> {
        return this.apollo
            .watchQuery<{ vehicule: any }>({
                query: this.GET_VEHICLE_BY_ID,
                variables: { id },
            })
            .valueChanges.pipe(
                map(result => this.mapToVehicleModel(result.data.vehicule))
            );
    }

    /**
     * Get vehicles by brand
     */
    getVehiclesByBrand(brandId: string): Observable<VehicleModel[]> {
        return this.apollo
            .watchQuery<{ vehiculesByMarque: any[] }>({
                query: this.GET_VEHICLES_BY_BRAND,
                variables: { brandId },
            })
            .valueChanges.pipe(
                map(result =>
                    result.data.vehiculesByMarque.map(vehicle => this.mapToVehicleModel(vehicle))
                )
            );
    }

    /**
     * Create a new vehicle
     */
    createVehicle(input: CreateVehicleDto): Observable<VehicleModel> {
        return this.apollo
            .mutate<{ createVehicule: any }>({
                mutation: this.CREATE_VEHICLE,
                variables: {
                    input: this.mapToBackendInput(input)
                },
                refetchQueries: [{ query: this.GET_ALL_VEHICLES }],
            })
            .pipe(
                map(result => this.mapToVehicleModel(result.data!.createVehicule))
            );
    }

    /**
     * Update an existing vehicle
     */
    updateVehicle(input: UpdateVehicleDto): Observable<VehicleModel> {
        return this.apollo
            .mutate<{ updateVehicule: any }>({
                mutation: this.UPDATE_VEHICLE,
                variables: {
                    input: this.mapToBackendUpdateInput(input)
                },
                refetchQueries: [
                    { query: this.GET_ALL_VEHICLES },
                    { query: this.GET_VEHICLE_BY_ID, variables: { id: input.id } }
                ],
            })
            .pipe(
                map(result => this.mapToVehicleModel(result.data!.updateVehicule))
            );
    }

    /**
     * Delete a vehicle (soft delete)
     */
    deleteVehicle(id: string): Observable<boolean> {
        return this.apollo
            .mutate<{ deleteVehicule: boolean }>({
                mutation: this.DELETE_VEHICLE,
                variables: { id },
                refetchQueries: [{ query: this.GET_ALL_VEHICLES }],
            })
            .pipe(
                map(result => result.data!.deleteVehicule)
            );
    }

    /**
     * Map backend data to VehicleModel
     */
    private mapToVehicleModel(data: any): VehicleModel {
        return new VehicleModel({
            id: data.id,
            registrationNumber: data.matricule,
            brandId: data.marqueId,
            brand: data.marque ? {
                id: data.marque.id,
                label: data.marque.libelle,
                logoUrl: data.marque.logoUrl,
                description: data.marque.description,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true
            } : undefined,
            type: data.type,
            firstRegistrationDate: new Date(data.datePremiereMiseEnCirculation),
            power: data.puissance,
            energy: data.energie as EnergyType,
            mileage: data.compteur,
            color: data.couleur,
            purchasePrice: data.prixAchat,
            vehicleClass: data.classeVehicule as VehicleClass,
            dailyRentalPrice: data.prixLocationJournee,
            lateHourPrice: data.prixHeureRetard,
            spareWheel: data.roueSecours,
            jackHandle: data.cricManivelle,
            coverSet: data.jeuHousse,
            babySeat: data.siegeBebe,
            carpetSet: data.jeuTapis,
            radio: data.posteRadio,
            hubcapSet: data.jeuEnjoliveurs,
            observations: data.observations,
            imageUrl: data.imageUrl,
            createdBy: data.saisiPar,
            modifiedBy: data.modifiePar,
            createdAt: data.saisiLe ? new Date(data.saisiLe) : new Date(),
            modifiedAt: data.modifieLe ? new Date(data.modifieLe) : new Date(),
            isActive: data.estActif
        });
    }

    /**
     * Map CreateVehicleDto to backend input
     */
    private mapToBackendInput(dto: CreateVehicleDto): any {
        // Format date as YYYY-MM-DD (MySQL datetime format)
        const date = dto.firstRegistrationDate instanceof Date
            ? dto.firstRegistrationDate
            : new Date(dto.firstRegistrationDate);

        const formattedDate = date.toISOString().split('T')[0] + ' 00:00:00';

        return {
            matricule: dto.registrationNumber,
            marqueId: dto.brandId,
            type: dto.type,
            datePremiereMiseEnCirculation: formattedDate,
            puissance: Number(dto.power) || 0,
            energie: dto.energy,
            compteur: Number(dto.mileage) || 0,
            couleur: dto.color || null,
            prixAchat: Number(dto.purchasePrice) || 0,
            classeVehicule: dto.vehicleClass,
            prixLocationJournee: Number(dto.dailyRentalPrice) || 0,
            prixHeureRetard: Number(dto.lateHourPrice) || 0,
            roueSecours: Boolean(dto.spareWheel),
            cricManivelle: Boolean(dto.jackHandle),
            jeuHousse: Boolean(dto.coverSet),
            siegeBebe: Boolean(dto.babySeat),
            jeuTapis: Boolean(dto.carpetSet),
            posteRadio: Boolean(dto.radio),
            jeuEnjoliveurs: Boolean(dto.hubcapSet),
            observations: dto.observations || null,
            imageUrl: dto.imageUrl || null,
            saisiPar: dto.createdBy || null
        };
    }

    /**
     * Map UpdateVehicleDto to backend input
     */
    private mapToBackendUpdateInput(dto: UpdateVehicleDto): any {
        const input: any = { id: dto.id };

        if (dto.registrationNumber !== undefined) input.matricule = dto.registrationNumber;
        if (dto.brandId !== undefined) input.marqueId = dto.brandId;
        if (dto.type !== undefined) input.type = dto.type;

        if (dto.firstRegistrationDate !== undefined) {
            const date = dto.firstRegistrationDate instanceof Date
                ? dto.firstRegistrationDate
                : new Date(dto.firstRegistrationDate);
            input.datePremiereMiseEnCirculation = date.toISOString().split('T')[0] + ' 00:00:00';
        }

        if (dto.power !== undefined) input.puissance = Number(dto.power) || 0;
        if (dto.energy !== undefined) input.energie = dto.energy;
        if (dto.mileage !== undefined) input.compteur = Number(dto.mileage) || 0;
        if (dto.color !== undefined) input.couleur = dto.color || null;
        if (dto.purchasePrice !== undefined) input.prixAchat = Number(dto.purchasePrice) || 0;
        if (dto.vehicleClass !== undefined) input.classeVehicule = dto.vehicleClass;
        if (dto.dailyRentalPrice !== undefined) input.prixLocationJournee = Number(dto.dailyRentalPrice) || 0;
        if (dto.lateHourPrice !== undefined) input.prixHeureRetard = Number(dto.lateHourPrice) || 0;
        if (dto.spareWheel !== undefined) input.roueSecours = Boolean(dto.spareWheel);
        if (dto.jackHandle !== undefined) input.cricManivelle = Boolean(dto.jackHandle);
        if (dto.coverSet !== undefined) input.jeuHousse = Boolean(dto.coverSet);
        if (dto.babySeat !== undefined) input.siegeBebe = Boolean(dto.babySeat);
        if (dto.carpetSet !== undefined) input.jeuTapis = Boolean(dto.carpetSet);
        if (dto.radio !== undefined) input.posteRadio = Boolean(dto.radio);
        if (dto.hubcapSet !== undefined) input.jeuEnjoliveurs = Boolean(dto.hubcapSet);
        if (dto.observations !== undefined) input.observations = dto.observations || null;
        if (dto.imageUrl !== undefined) input.imageUrl = dto.imageUrl || null;
        if (dto.modifiedBy !== undefined) input.modifiePar = dto.modifiedBy;

        return input;
    }
}