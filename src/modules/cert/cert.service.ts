import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cert } from './entities/cert.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCertDto } from './dto/create-cert.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CertService {
  constructor(
    @InjectRepository(Cert)
    private readonly certRepository: Repository<Cert>,
  ) {}

  async create(createCertDto: CreateCertDto): Promise<Cert> {
    const cert = this.certRepository.create(createCertDto);
    return this.certRepository.save(cert);
  }

  async findAll(): Promise<Cert[]> {
    return this.certRepository.find();
  }

  async findOne(id: string): Promise<Cert | null> {
    return this.certRepository.findOneById(id);
  }

  async remove(id: string): Promise<any> {
    const cert = await this.certRepository.findOneById(id);

    if (cert?.image) {
      const isUrl =
        cert.image.startsWith('http://') || cert.image.startsWith('https://');
      if (!isUrl) {
        const filepath = path.join(__dirname, '..', '..', '..', cert.image);
        try {
          await fs.promises.unlink(filepath);
        } catch (error) {
          console.error('Image file not found:', error);
        }
      }
    }

    await this.certRepository.delete(id);
    return { success: true };
  }

  uploadFile(file: Express.Multer.File): string {
    return file.path;
  }
}
