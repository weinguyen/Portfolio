import { OmitType } from '@nestjs/swagger';
import { Video } from '../entities/video.entity';
export class CreateVideoDto extends OmitType(Video, ['id'] as const) {}
