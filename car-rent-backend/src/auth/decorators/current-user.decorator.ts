import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // Pour les requêtes REST
    const request = context.switchToHttp().getRequest();
    if (request?.user) {
      return request.user;
    }

    // Pour les requêtes GraphQL
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req?.user;
  },
);
