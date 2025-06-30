import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { TransactionType } from './transaction-type.enum';

export type TransactionDocument = Transaction & Document;

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

@ObjectType()
@Schema({ timestamps: true })
export class Transaction {
  @Field(() => ID)
  _id!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => ID)
  userId!: string;

  @Prop({ required: true, enum: TransactionType })
  @Field(() => TransactionType)
  type!: TransactionType;

  @Prop({ required: true })
  @Field(() => Float)
  amount!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
