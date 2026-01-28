import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard pour protéger les resolvers GraphQL avec JWT
 * Utilisation : @UseGuards(GqlAuthGuard)
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /**
   * Récupère la requête depuis le contexte GraphQL
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
    return ctx.getContext().req;
  }
}
