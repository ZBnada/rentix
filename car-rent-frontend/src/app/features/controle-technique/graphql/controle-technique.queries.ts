import { gql } from 'apollo-angular';

const CT_FULL_FRAGMENT = `
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
`;

export const GET_CONTROLES_TECHNIQUES = gql`
  query GetControlesTechniques {
    controlesTechniques {
      ${CT_FULL_FRAGMENT}
    }
  }
`;

export const GET_CONTROLE_TECHNIQUE = gql`
  query GetControleTechnique($id: String!) {
    controleTechnique(id: $id) {
      ${CT_FULL_FRAGMENT}
    }
  }
`;

export const GET_VEHICULES = gql`
  query GetVehiculesForCT {
    vehicules {
      id
      matricule
      marque { libelle }
    }
  }
`;

export const GET_MODES_PAIEMENT = gql`
  query GetModesPaiementForCT {
    modesPaiement {
      id
      type
      libelle
      icon
    }
  }
`;

export const CREATE_CONTROLE_TECHNIQUE = gql`
  mutation CreateControleTechnique($input: CreateControleTechniqueInput!) {
    createControleTechnique(input: $input) {
      ${CT_FULL_FRAGMENT}
    }
  }
`;

export const UPDATE_CONTROLE_TECHNIQUE = gql`
  mutation UpdateControleTechnique($input: UpdateControleTechniqueInput!) {
    updateControleTechnique(input: $input) {
      ${CT_FULL_FRAGMENT}
    }
  }
`;

export const VALIDER_CONTROLE_TECHNIQUE = gql`
  mutation ValiderControleTechnique($id: String!, $validerPar: String!) {
    validerControleTechnique(id: $id, validerPar: $validerPar) {
      id
      statut
      validePar
    }
  }
`;

export const ANNULER_CONTROLE_TECHNIQUE = gql`
  mutation AnnulerControleTechnique($id: String!, $annulePar: String!) {
    annulerControleTechnique(id: $id, annulePar: $annulePar) {
      id
      statut
      annulePar
    }
  }
`;

export const DELETE_CONTROLE_TECHNIQUE = gql`
  mutation DeleteControleTechnique($id: String!) {
    deleteControleTechnique(id: $id)
  }
`;