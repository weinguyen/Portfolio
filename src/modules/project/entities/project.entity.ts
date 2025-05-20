import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('phuc-project')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column()
  @ApiProperty()
  @IsString()
  title: string;
  @IsString()
  @ApiProperty()
  @Column()
  description: string;
  @ApiProperty()
  @Column({ nullable: true })
  github: string;
  @ApiProperty()
  @Column()
  @IsString()
  image: string;
}
