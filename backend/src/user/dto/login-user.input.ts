import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field({ description: 'The user’s phone number used to login' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\d{10,15}$/, {
    message: 'Phone number must be between 10 and 15 digits',
  })
  phoneNumber!: string;

  @Field({ description: 'The user’s password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password!: string;
}
