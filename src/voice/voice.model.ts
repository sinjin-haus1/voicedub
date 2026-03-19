import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoiceDocument = Voice & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Voice {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  text: string;

  @Field()
  @Prop()
  voiceId: string;

  @Field()
  @Prop()
  audioUrl: string;

  @Field()
  @Prop({ default: 'pending' })
  status: string;

  @Field()
  @Prop()
  userId: string;
}

export const VoiceSchema = SchemaFactory.createForClass(Voice);
