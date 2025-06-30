import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

export type UserDocument = Document & User;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id!: string;

  @Prop({ required: true })
  @Field()
  fullName!: string;

  @Prop({ required: true, unique: true })
  @Field()
  phoneNumber!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: 0 })
  @Field(() => Float)
  balance!: number;

  @Prop({ default: 0 })
  @Field(() => Float)
  withdrawalLimit!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
