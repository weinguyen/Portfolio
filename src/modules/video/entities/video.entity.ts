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
  @ApiProperty()
  play_count: number;
  @Column({ nullable: true })
  @ApiProperty()
  like_count: number;
  @Column({ nullable: true })
  @ApiProperty()
  comment_count: number;
  @Column({ nullable: true })
  @ApiProperty()
  share_count: number;
  @Column({ nullable: true })
  @ApiProperty()
  download_count: number;
  @Column({ nullable: true })
  @ApiProperty()
  collect_count: number;
}
