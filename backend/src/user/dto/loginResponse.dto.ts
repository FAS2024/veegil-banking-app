import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../user.schema';

@ObjectType()
export class LoginResponse {
  @Field()
  token!: string;

  @Field(() => User)
  user!: User; // This works for both GraphQL and tests
}
