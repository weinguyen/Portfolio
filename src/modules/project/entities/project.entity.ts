import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
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
  @Column('text', { array: true, default: [] })
  @IsString({ each: true })
  image: string[];
}
