import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

type GraphqlRequestContext = {
  req?: {
    user?: unknown;
  };
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GraphqlRequestContext>();
    return gqlContext.req?.user;
  },
);
