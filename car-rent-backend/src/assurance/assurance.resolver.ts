import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { AssuranceService } from './assurance.service';
import { AssuranceResource } from './dto/assurance.resource';
import { CreateAssuranceInput } from './dto/create-assurance.input';
import { UpdateAssuranceInput } from './dto/update-assurance.input';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const ASSURANCE_UPDATED_EVENT = 'assuranceUpdated';

@Resolver(() => AssuranceResource)
export class AssuranceResolver {
  @Inject('PUB_SUB')
  pubSub: PubSub;

  constructor(private readonly assuranceService: AssuranceService) {}

  @Mutation(() => AssuranceResource, { name: 'createAssurance' })
  async createAssurance(
    @Args('input', { type: () => CreateAssuranceInput })
    input: CreateAssuranceInput,
  ): Promise<AssuranceResource> {
    const result = await this.assuranceService.createAssurance(input);
    await this.pubSub.publish(ASSURANCE_UPDATED_EVENT, {
      assuranceUpdated: result,
      action: 'create',
    });
    return result;
  }

  @Query(() => [AssuranceResource], { name: 'assurances' })
  async findAllAssurances(): Promise<AssuranceResource[]> {
    return this.assuranceService.findAllAssurances();
  }

  @Query(() => AssuranceResource, { name: 'assurance', nullable: true })
  async findAssuranceById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<AssuranceResource> {
    return this.assuranceService.findAssuranceById(id);
  }

  @Query(() => [AssuranceResource], { name: 'assurancesByVehicule' })
  async findAssurancesByVehicule(
    @Args('vehiculeId', { type: () => String }) vehiculeId: string,
  ): Promise<AssuranceResource[]> {
    return this.assuranceService.findAssurancesByVehicule(vehiculeId);
  }

  @Query(() => [AssuranceResource], { name: 'assurancesExpiringSoon' })
  async findAssurancesExpiringSoon(
    @Args('daysBeforeExpiry', { type: () => Int, defaultValue: 30 })
    daysBeforeExpiry: number,
  ): Promise<AssuranceResource[]> {
    return this.assuranceService.findAssurancesExpiringSoon(daysBeforeExpiry);
  }

  @Mutation(() => AssuranceResource, { name: 'updateAssurance' })
  async updateAssurance(
    @Args('input', { type: () => UpdateAssuranceInput })
    input: UpdateAssuranceInput,
  ): Promise<AssuranceResource> {
    const result = await this.assuranceService.updateAssurance(input);
    await this.pubSub.publish(ASSURANCE_UPDATED_EVENT, {
      assuranceUpdated: result,
      action: 'update',
    });
    return result;
  }

  @Mutation(() => Boolean, { name: 'deleteAssurance' })
  async deleteAssurance(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    // ✅ Récupérer l'assurance COMPLÈTE avant suppression
    // Après deleteAssurance() → estActif=false → findById() lève une exception
    // Donc on récupère avant, puis on override estActif=false dans le publish
    const assuranceComplete = await this.assuranceService.findAssuranceById(id);

    const success = await this.assuranceService.deleteAssurance(id);

    if (success) {
      // ✅ Publier l'objet complet avec tous les champs non-nullable
      // vehiculeId, prestataire, etc. sont présents → plus d'erreur Apollo
      await this.pubSub.publish(ASSURANCE_UPDATED_EVENT, {
        assuranceUpdated: {
          ...assuranceComplete, // tous les champs complets
          estActif: false, // override → frontend sait que c'est un delete
        },
        action: 'delete',
      });
    }

    return success;
  }

  @Subscription(() => AssuranceResource, {
    name: 'assuranceUpdated',
    filter: (payload, variables) => {
      if (!variables.ids || variables.ids.length === 0) return true;
      return variables.ids.includes(payload.assuranceUpdated.id);
    },
    nullable: true,
  })
  assuranceUpdated(
    @Args({ name: 'ids', type: () => [String], nullable: true }) ids?: string[],
  ) {
    return this.pubSub.asyncIterableIterator(ASSURANCE_UPDATED_EVENT);
  }
}
