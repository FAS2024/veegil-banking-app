import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  fullName: string;

  @Prop({ required: true, unique: true })
  @Field()
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  @Field(() => Float)
  balance: number;

  @Prop({ default: 0 })
  @Field(() => Float)
  withdrawalLimit: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type UserDocument = Document & User;

export const UserSchema = SchemaFactory.createForClass(User);


// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

// export type UserDocument = User & Document;

// @ObjectType()
// @Schema({ timestamps: true })
// export class User {
//   @Field(() => ID)
//   _id: string;

//   @Prop({ required: true })
//   @Field()
//   fullName: string;

//   @Prop({ required: true, unique: true })
//   @Field()
//   phoneNumber: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ default: 0 })
//   @Field(() => Float, { nullable: true })
//   balance?: number;

//   @Prop({ default: 0 })
//   @Field(() => Float, { nullable: true })
//   withdrawalLimit?: number;

//   @Field()
//   createdAt: Date;

//   @Field()
//   updatedAt: Date;
// }

// export const UserSchema = SchemaFactory.createForClass(User);


// // // -------------------- src/user/user.schema.ts --------------------
// // import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// // import { Document } from 'mongoose';
// // import { ObjectType, Field, ID } from '@nestjs/graphql';

// // export type UserDocument = User & Document;

// // @ObjectType()
// // @Schema({ timestamps: true })
// // export class User {
// //   @Field(() => ID)
// //   _id: string;

// //   @Prop({ required: true })
// //   @Field()
// //   fullName: string;

// //   @Prop({ required: true, unique: true })
// //   @Field()
// //   phoneNumber: string;

// //   @Prop({ required: true })
// //   password: string; // Not exposed to GraphQL

// //   @Prop({ required: true, default: 0 })
// //   @Field()
// //   balance: number;

// // }

// // export const UserSchema = SchemaFactory.createForClass(User);
