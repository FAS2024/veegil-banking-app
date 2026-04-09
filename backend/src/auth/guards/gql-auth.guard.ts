import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

type GraphqlRequestContext = {
  req?: unknown;
};

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): unknown {
    const ctx = GqlExecutionContext.create(context);
    if (!ctx) {
      return undefined;
    }
    const gqlContext = ctx.getContext<GraphqlRequestContext>();
    return gqlContext.req;
  }
}
