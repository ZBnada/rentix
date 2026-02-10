import { Injectable } from '@nestjs/common';
import { Entretien } from '../entities/entretien.entity';
import { EntretienResource } from '../dto/entretien.resource';
import { CreateEntretienInput } from '../dto/create-entretien.input';
import { UpdateEntretienInput } from '../dto/update-entretien.input';

/**
 * Mapper pour Entretien
 * Gère la conversion entre Entity, Resource et Input
 * ✅ CORRECTION: Conversion bidirectionnelle Date ↔ String
 */
@Injectable()
export class EntretienMapper {
  /**
   * ✅ HELPER: Convertir une Date en string (YYYY-MM-DD)
   */
  private dateToString(date: Date | null | undefined): string | null {
    if (!date) {
      return null;
    }

    if (!(date instanceof Date)) {
      return null;
    }

    // Format ISO (YYYY-MM-DD)
    return date.toISOString().split('T')[0];
  }

  /**
   * ✅ HELPER: Convertir une Date en string ISO complet (pour saisiLe/modifieLe)
   */
  private dateToISOString(date: Date | null | undefined): string | null {
    if (!date) {
      return null;
    }

    if (!(date instanceof Date)) {
      return null;
    }

    return date.toISOString();
  }

  /**
   * ✅ HELPER: Convertir une string en Date
   */
  private stringToDate(
    dateString: string | Date | null | undefined,
  ): Date | null {
    if (!dateString) {
      return null;
    }

    // Si c'est déjà une Date, la retourner
    if (dateString instanceof Date) {
      return dateString;
    }

    // Sinon, convertir la string en Date
    const date = new Date(dateString);

    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
      throw new Error(`Date invalide: ${dateString}`);
    }

    return date;
  }

  /**
   * Convertir une entité en Resource GraphQL
   * ✅ CORRECTION: Conversion Date → String
   */
  toResource(entity: Entretien): EntretienResource | null {
    if (!entity) {
      return null;
    }

    const resource = new EntretienResource();
    resource.id = entity.id;
    resource.typeEntretienId = entity.typeEntretienId;
    resource.typeEntretien = entity.typeEntretien;
    resource.vehiculeId = entity.vehiculeId;
    resource.vehicule = entity.vehicule;

    // ✅ Conversion Date → String pour GraphQL
    resource.dateDebutOperation =
      this.dateToString(entity.dateDebutOperation) || '';
    resource.dateFinOperation =
      this.dateToString(entity.dateFinOperation) || '';
    resource.dateLimiteProchainEntretien = this.dateToString(
      entity.dateLimiteProchainEntretien,
    );

    resource.kilometrageArret = entity.kilometrageArret;
    resource.kilometrageLimiteProchainEntretien =
      entity.kilometrageLimiteProchainEntretien;
    resource.codePersonnel = entity.codePersonnel;
    resource.nomPrenomPersonnel = entity.nomPrenomPersonnel;
    resource.observations = entity.observations;
    resource.coutTotal = entity.coutTotal;
    resource.etat = entity.etat;
    resource.saisiPar = entity.saisiPar;
    resource.modifiePar = entity.modifiePar;

    // ✅ Conversion Date → ISO String pour audit
    resource.saisiLe =
      this.dateToISOString(entity.saisiLe) || new Date().toISOString();
    resource.modifieLe =
      this.dateToISOString(entity.modifieLe) || new Date().toISOString();

    resource.estActif = entity.estActif;

    return resource;
  }

  /**
   * Convertir une liste d'entités en liste de Resources
   */
  toResourceList(entities: Entretien[]): EntretienResource[] {
    return entities
      .map((entity) => this.toResource(entity))
      .filter((resource): resource is EntretienResource => resource !== null);
  }

  /**
   * Convertir un CreateInput en entité
   * ✅ CORRECTION: Conversion String → Date
   */
  createInputToEntity(input: CreateEntretienInput): Entretien {
    const entity = new Entretien();

    entity.typeEntretienId = input.typeEntretienId;
    entity.vehiculeId = input.vehiculeId;

    // ✅ Conversion des dates String → Date
    entity.dateDebutOperation = this.stringToDate(input.dateDebutOperation)!;
    entity.dateFinOperation = this.stringToDate(input.dateFinOperation)!;

    entity.kilometrageArret = input.kilometrageArret;
    entity.kilometrageLimiteProchainEntretien =
      input.kilometrageLimiteProchainEntretien || null;

    // ✅ Conversion de la date limite
    entity.dateLimiteProchainEntretien = input.dateLimiteProchainEntretien
      ? this.stringToDate(input.dateLimiteProchainEntretien)
      : null;

    entity.codePersonnel = input.codePersonnel || null;
    entity.nomPrenomPersonnel = input.nomPrenomPersonnel || null;
    entity.observations = input.observations || null;
    entity.coutTotal = input.coutTotal || 0;
    entity.etat = input.etat || 'TERMINE';
    entity.estActif = true;

    return entity;
  }

  /**
   * Mettre à jour une entité à partir d'un UpdateInput
   * ✅ CORRECTION: Conversion String → Date
   */
  updateInputToEntity(
    existingEntity: Entretien,
    input: UpdateEntretienInput,
  ): Entretien {
    if (input.typeEntretienId !== undefined) {
      existingEntity.typeEntretienId = input.typeEntretienId;
    }
    if (input.vehiculeId !== undefined) {
      existingEntity.vehiculeId = input.vehiculeId;
    }

    // ✅ Conversion des dates si présentes
    if (input.dateDebutOperation !== undefined) {
      existingEntity.dateDebutOperation = this.stringToDate(
        input.dateDebutOperation,
      )!;
    }
    if (input.dateFinOperation !== undefined) {
      existingEntity.dateFinOperation = this.stringToDate(
        input.dateFinOperation,
      )!;
    }

    if (input.kilometrageArret !== undefined) {
      existingEntity.kilometrageArret = input.kilometrageArret;
    }
    if (input.kilometrageLimiteProchainEntretien !== undefined) {
      existingEntity.kilometrageLimiteProchainEntretien =
        input.kilometrageLimiteProchainEntretien;
    }

    // Conversion de la date limite
    if (input.dateLimiteProchainEntretien !== undefined) {
      existingEntity.dateLimiteProchainEntretien =
        input.dateLimiteProchainEntretien
          ? this.stringToDate(input.dateLimiteProchainEntretien)
          : null;
    }

    if (input.codePersonnel !== undefined) {
      existingEntity.codePersonnel = input.codePersonnel;
    }
    if (input.nomPrenomPersonnel !== undefined) {
      existingEntity.nomPrenomPersonnel = input.nomPrenomPersonnel;
    }
    if (input.observations !== undefined) {
      existingEntity.observations = input.observations;
    }
    if (input.coutTotal !== undefined) {
      existingEntity.coutTotal = input.coutTotal;
    }
    if (input.etat !== undefined) {
      existingEntity.etat = input.etat;
    }

    return existingEntity;
  }
}
