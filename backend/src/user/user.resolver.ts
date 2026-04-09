// -------------------- src/user/user.resolver.ts --------------------
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { LoginResponse } from './dto/loginResponse.dto';
import { User } from './user.schema';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello from GraphQL!';
  }

  @Mutation(() => LoginResponse)
  async signup(@Args('input') input: CreateUserInput): Promise<LoginResponse> {
    return this.userService.signup(input);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginUserInput): Promise<LoginResponse> {
    return this.userService.login(input.phoneNumber, input.password);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async whoAmI(@CurrentUser() user: { _id: string }): Promise<User> {
    return this.userService.findById(user._id);
  }
}
