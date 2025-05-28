import { PickType } from '@nestjs/swagger';
import { Video } from '../entities/video.entity';
export class CreateVideoDto extends PickType(Video, ['link'] as const) {}
