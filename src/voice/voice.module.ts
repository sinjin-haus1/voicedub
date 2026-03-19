import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Voice, VoiceSchema } from './voice.model';
import { VoiceResolver } from './voice.resolver';
import { VoiceService } from './voice.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Voice.name, schema: VoiceSchema }]),
  ],
  providers: [VoiceResolver, VoiceService],
})
export class VoiceModule {}
