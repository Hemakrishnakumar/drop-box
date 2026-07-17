import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticatedGraphqlContext } from '../types/common';

export const CurrentUserId = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
    const gqlContext = GqlExecutionContext.create(ctx).getContext<AuthenticatedGraphqlContext>();
    return gqlContext.userId;
});
