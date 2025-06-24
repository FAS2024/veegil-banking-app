import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    if (!ctx) {
      return undefined;  // Return undefined instead of null
    }
    const gqlContext = ctx.getContext?.();
    return gqlContext?.req ?? undefined;  // Return undefined if req missing
  }
}
