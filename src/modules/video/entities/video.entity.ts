import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('phuc-video')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @ApiProperty()
  link: string;

  @Column({ nullable: true })
  play_count: number;
  @Column({ nullable: true })
  like_count: number;
  @Column({ nullable: true })
  comment_count: number;
  @Column({ nullable: true })
  share_count: number;
  @Column({ nullable: true })
  download_count: number;
  @Column({ nullable: true })
  collect_count: number;
}
