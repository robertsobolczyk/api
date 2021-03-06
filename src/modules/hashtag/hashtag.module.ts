import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { ESIModule } from '../core/external/esi/esi.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagRepository } from './hashtag.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([HashtagRepository]),

    ESIModule,
  ],
  providers: [
    HashtagService,
  ],
  exports: [
    HashtagService,
  ],
})
export class HashtagModule {
}
