import { Module } from '@nestjs/common';
import { CertController } from './cert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cert } from './entities/cert.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CertService } from './cert.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cert]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [CertController],
  providers: [CertService],
})
export class CertModule {}
