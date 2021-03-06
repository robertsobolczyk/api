import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ICharacterStatistics } from '../core/external/zkillboard/zkillboard.interface';
import { IGetCharacter } from '../core/external/esi/esi.interface';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { ICharacterPortrait } from './character.interface';
import { KillmailParticipant } from '../killmail/participant/participant.entity';
import { Corporation } from '../corporation/corporation.entity';
import { Notification } from '../notification/notification.entity';
import { Follow } from '../follow/follow.entity';

@Entity()
export class Character {

  @PrimaryColumn('int')
  id: number;

  @Column({ unique: true })
  handle: string;

  @OneToMany(type => Post, post => post.character)
  posts: Post[];

  @OneToMany(type => KillmailParticipant, killmailParticipant => killmailParticipant.character)
  killmails: KillmailParticipant[];

  @OneToMany(type => Comment, comment => comment.character)
  comments: Comment[];

  @OneToMany(type => Corporation, corporation => corporation.creator)
  createdCorporations: Corporation[];

  @OneToMany(type => Corporation, corporation => corporation.ceo)
  corporationCeo: Corporation[];

  @ManyToOne(type => Corporation, corporation => corporation.characters, { eager: true })
  corporation: Corporation;

  @OneToMany(type => Post, post => post.characterWall)
  wall: Post[];

  @OneToMany(type => Notification, notification => notification.recipient)
  notifications: Notification[];

  @OneToMany(type => Follow, follow => follow.follower)
  following: Follow[];

  @OneToMany(type => Follow, follow => follow.followingCharacter)
  followers: Follow[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  gender: string;

  @Column()
  raceId: number;

  @Column()
  bloodlineId: number;

  @Column({ nullable: true })
  ancestryId: number;

  @Column('real')
  securityStatus: number;

  get portrait(): ICharacterPortrait {
    return {
      px64x64: `https://imageserver.eveonline.com/Character/${this.id}_64.jpg`,
      px128x128: `https://imageserver.eveonline.com/Character/${this.id}_128.jpg`,
      px256x256: `https://imageserver.eveonline.com/Character/${this.id}_256.jpg`,
      px512x512: `https://imageserver.eveonline.com/Character/${this.id}_512.jpg`,
    };
  }

  public populateESI(char: IGetCharacter) {
    this.name = char.name;
    this.description = char.description;
    this.gender = char.gender;
    this.raceId = char.race_id;
    this.bloodlineId = char.bloodline_id;
    this.ancestryId = char.ancestry_id;
    this.securityStatus = char.security_status;
  }
}
