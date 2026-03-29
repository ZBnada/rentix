import { gql } from 'apollo-angular';

export const GET_VIGNETTES = gql`
  query GetVignettes {
    vignettes {
      id
      numeroFiche
      statut
      montant
      montantReste
      dateFinValidite
      dateOperation
      saisiPar
      saisiLe
      vehicule {
        id
        matricule
        marque { libelle }
      }
      lignesReglement {
        id
        modePaiement { libelle icon type }
        montant
        designation
        dateOperation
      }
    }
  }
`;

export const GET_VIGNETTE = gql`
  query GetVignette($id: String!) {
    vignette(id: $id) {
      id
      numeroFiche
      statut
      montant
      montantReste
      dateFinValidite
      dateOperation
      saisiPar
      saisiLe
      modifiePar
      modifieLe
      vehicule {
        id
        matricule
        marque { libelle }
      }
      lignesReglement {
        id
        modePaiementId
        modePaiement { id libelle icon type }
        designation
        montant
        echeance
        referencePiece
        banque
        porteur
        dateOperation
      }
    }
  }
`;

export const GET_VEHICULES = gql`
  query GetVehicules {
    vehicules {
      id
      matricule
      marque { libelle }
    }
  }
`;

export const GET_MODES_PAIEMENT = gql`
  query GetModesPaiement {
    modesPaiement {
      id
      type
      libelle
      icon
    }
  }
`;

export const CREATE_VIGNETTE = gql`
  mutation CreateVignette($input: CreateVignetteInput!) {
    createVignette(input: $input) {
      id
      numeroFiche
      statut
      montant
      montantReste
      dateFinValidite
      dateOperation
      saisiPar
      saisiLe
      vehicule {
        id
        matricule
        marque { libelle }
      }
      lignesReglement {
        id
        modePaiement { libelle icon type }
        montant
        designation
        dateOperation
      }
    }
  }
`;

export const VALIDER_VIGNETTE = gql`
  mutation ValiderVignette($id: String!, $validerPar: String!) {
    validerVignette(id: $id, validerPar: $validerPar) {
      id
      statut
      modifiePar
      modifieLe
    }
  }
`;

export const ANNULER_VIGNETTE = gql`
  mutation AnnulerVignette($id: String!, $annulePar: String!) {
    annulerVignette(id: $id, annulePar: $annulePar) {
      id
      statut
      modifiePar
    }
  }
`;

export const DELETE_VIGNETTE = gql`
  mutation DeleteVignette($id: String!) {
    deleteVignette(id: $id)
  }
`;

export const UPDATE_VIGNETTE = gql`
  mutation UpdateVignette($input: UpdateVignetteInput!) {
    updateVignette(input: $input) {
      id
      numeroFiche
      statut
      montant
      montantReste
      dateFinValidite
      dateOperation
      saisiPar
      saisiLe
      modifiePar
      modifieLe
      vehicule {
        id
        matricule
        marque { libelle }
      }
      lignesReglement {
        id
        modePaiementId
        modePaiement { id libelle icon type }
        designation
        montant
        echeance
        referencePiece
        banque
        porteur
        dateOperation
      }
    }
  }
`;