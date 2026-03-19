import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Voice } from './voice.model';
import { VoiceService } from './voice.service';

@Resolver(() => Voice)
export class VoiceResolver {
  constructor(private readonly voiceService: VoiceService) {}

  @Query(() => [Voice])
  async voices(@Args('userId', { nullable: true }) userId?: string) {
    return this.voiceService.findAll(userId);
  }

  @Query(() => Voice, { nullable: true })
  async voice(@Args('id', { type: () => ID }) id: string) {
    return this.voiceService.findOne(id);
  }

  @Mutation(() => Voice)
  async createVoice(
    @Args('name') name: string,
    @Args('text') text: string,
    @Args('userId', { nullable: true }) userId?: string,
  ) {
    return this.voiceService.createVoice({ name, text, userId });
  }

  @Mutation(() => Voice)
  async updateVoiceStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status') status: string,
    @Args('audioUrl', { nullable: true }) audioUrl?: string,
  ) {
    return this.voiceService.updateStatus(id, status, audioUrl);
  }
}
