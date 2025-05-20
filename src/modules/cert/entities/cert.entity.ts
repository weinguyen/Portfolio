import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('cert')
export class Cert {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @ApiProperty()
  @Column()
  @IsString()
  title: string;
  @ApiProperty()
  @Column()
  @IsString()
  image: string;
}
