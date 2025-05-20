import { OmitType } from '@nestjs/swagger';
import { Cert } from '../entities/cert.entity';

export class CreateCertDto extends OmitType(Cert, ['id'] as const) {}
