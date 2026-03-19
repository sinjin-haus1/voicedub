import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voice, VoiceDocument } from './voice.model';

@Injectable()
export class VoiceService {
  constructor(@InjectModel(Voice.name) private voiceModel: Model<VoiceDocument>) {}

  async createVoice(input: { name: string; text: string; userId?: string }) {
    const voice = new this.voiceModel({
      ...input,
      status: 'processing',
    });
    return voice.save();
  }

  async findAll(userId?: string) {
    const filter = userId ? { userId } : {};
    return this.voiceModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    return this.voiceModel.findById(id).exec();
  }

  async updateStatus(id: string, status: string, audioUrl?: string) {
    return this.voiceModel.findByIdAndUpdate(
      id,
      { status, audioUrl },
      { new: true },
    ).exec();
  }
}
