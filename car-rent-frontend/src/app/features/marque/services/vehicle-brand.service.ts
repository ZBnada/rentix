import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
    VehicleBrandModel,
    CreateVehicleBrandDto,
    UpdateVehicleBrandDto
} from '../models/vehicle-brand.model';
@Injectable({
    providedIn: 'root'
})
export class VehicleBrandService {
    constructor(private readonly apollo: Apollo) {}

    /**
     * GraphQL Queries
     */
    private readonly GET_ALL_BRANDS = gql`
    query GetAllVehicleBrands {
      marquesVehicule {
        id
        libelle
        logoUrl
        description
        createdAt
        updatedAt
        estActif
      }
    }
  `;

    private readonly GET_BRAND_BY_ID = gql`
    query GetVehicleBrandById($id: String!) {
      marqueVehicule(id: $id) {
        id
        libelle
        logoUrl
        description
        createdAt
        updatedAt
        estActif
      }
    }
  `;

    private readonly SEARCH_BRANDS = gql`
    query SearchVehicleBrands($searchTerm: String!) {
      searchMarquesVehicule(searchTerm: $searchTerm) {
        id
        libelle
        logoUrl
        description
        createdAt
        updatedAt
        estActif
      }
    }
  `;

    /**
     * GraphQL Mutations
     */
    private readonly CREATE_BRAND = gql`
    mutation CreateVehicleBrand($input: CreateMarqueVehiculeInput!) {
      createMarqueVehicule(input: $input) {
        id
        libelle
        logoUrl
        description
        createdAt
        updatedAt
        estActif
      }
    }
  `;

    private readonly UPDATE_BRAND = gql`
    mutation UpdateVehicleBrand($input: UpdateMarqueVehiculeInput!) {
      updateMarqueVehicule(input: $input) {
        id
        libelle
        logoUrl
        description
        createdAt
        updatedAt
        estActif
      }
    }
  `;

    private readonly DELETE_BRAND = gql`
    mutation DeleteVehicleBrand($id: String!) {
      deleteMarqueVehicule(id: $id)
    }
  `;

    /**
     * Get all active vehicle brands
     */
    getAllBrands(): Observable<VehicleBrandModel[]> {
        return this.apollo
            .watchQuery<{ marquesVehicule: any[] }>({
                query: this.GET_ALL_BRANDS,
            })
            .valueChanges.pipe(
                map(result =>
                    result.data.marquesVehicule.map(brand =>
                        new VehicleBrandModel({
                            id: brand.id,
                            label: brand.libelle,
                            logoUrl: brand.logoUrl,
                            description: brand.description,
                            createdAt: brand.createdAt,
                            updatedAt: brand.updatedAt,
                            isActive: brand.estActif
                        })
                    )
                )
            );
    }

    /**
     * Get vehicle brand by ID
     */
    getBrandById(id: string): Observable<VehicleBrandModel> {
        return this.apollo
            .watchQuery<{ marqueVehicule: any }>({
                query: this.GET_BRAND_BY_ID,
                variables: { id },
            })
            .valueChanges.pipe(
                map(result =>
                    new VehicleBrandModel({
                        id: result.data.marqueVehicule.id,
                        label: result.data.marqueVehicule.libelle,
                        logoUrl: result.data.marqueVehicule.logoUrl,
                        description: result.data.marqueVehicule.description,
                        createdAt: result.data.marqueVehicule.createdAt,
                        updatedAt: result.data.marqueVehicule.updatedAt,
                        isActive: result.data.marqueVehicule.estActif
                    })
                )
            );
    }

    /**
     * Search vehicle brands by label
     */
    searchBrands(searchTerm: string): Observable<VehicleBrandModel[]> {
        return this.apollo
            .watchQuery<{ searchMarquesVehicule: any[] }>({
                query: this.SEARCH_BRANDS,
                variables: { searchTerm },
            })
            .valueChanges.pipe(
                map(result =>
                    result.data.searchMarquesVehicule.map(brand =>
                        new VehicleBrandModel({
                            id: brand.id,
                            label: brand.libelle,
                            logoUrl: brand.logoUrl,
                            description: brand.description,
                            createdAt: brand.createdAt,
                            updatedAt: brand.updatedAt,
                            isActive: brand.estActif
                        })
                    )
                )
            );
    }

    /**
     * Create a new vehicle brand
     */
    createBrand(input: CreateVehicleBrandDto): Observable<VehicleBrandModel> {
        return this.apollo
            .mutate<{ createMarqueVehicule: any }>({
                mutation: this.CREATE_BRAND,
                variables: {
                    input: {
                        libelle: input.label,
                        logoUrl: input.logoUrl,
                        description: input.description
                    }
                },
                refetchQueries: [{ query: this.GET_ALL_BRANDS }],
            })
            .pipe(
                map(result =>
                    new VehicleBrandModel({
                        id: result.data!.createMarqueVehicule.id,
                        label: result.data!.createMarqueVehicule.libelle,
                        logoUrl: result.data!.createMarqueVehicule.logoUrl,
                        description: result.data!.createMarqueVehicule.description,
                        createdAt: result.data!.createMarqueVehicule.createdAt,
                        updatedAt: result.data!.createMarqueVehicule.updatedAt,
                        isActive: result.data!.createMarqueVehicule.estActif
                    })
                )
            );
    }

    /**
     * Update an existing vehicle brand
     */
    updateBrand(input: UpdateVehicleBrandDto): Observable<VehicleBrandModel> {
        return this.apollo
            .mutate<{ updateMarqueVehicule: any }>({
                mutation: this.UPDATE_BRAND,
                variables: {
                    input: {
                        id: input.id,
                        libelle: input.label,
                        logoUrl: input.logoUrl,
                        description: input.description
                    }
                },
                refetchQueries: [
                    { query: this.GET_ALL_BRANDS },
                    { query: this.GET_BRAND_BY_ID, variables: { id: input.id } }
                ],
            })
            .pipe(
                map(result =>
                    new VehicleBrandModel({
                        id: result.data!.updateMarqueVehicule.id,
                        label: result.data!.updateMarqueVehicule.libelle,
                        logoUrl: result.data!.updateMarqueVehicule.logoUrl,
                        description: result.data!.updateMarqueVehicule.description,
                        createdAt: result.data!.updateMarqueVehicule.createdAt,
                        updatedAt: result.data!.updateMarqueVehicule.updatedAt,
                        isActive: result.data!.updateMarqueVehicule.estActif
                    })
                )
            );
    }

    /**
     * Delete a vehicle brand (soft delete)
     */
    deleteBrand(id: string): Observable<boolean> {
        return this.apollo
            .mutate<{ deleteMarqueVehicule: boolean }>({
                mutation: this.DELETE_BRAND,
                variables: { id },
                refetchQueries: [{ query: this.GET_ALL_BRANDS }],
            })
            .pipe(
                map(result => result.data!.deleteMarqueVehicule)
            );
    }
}