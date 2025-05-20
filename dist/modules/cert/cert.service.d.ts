import { Repository } from 'typeorm';
import { Cert } from './entities/cert.entity';
import { CreateCertDto } from './dto/create-cert.dto';
export declare class CertService {
    private readonly certRepository;
    constructor(certRepository: Repository<Cert>);
    create(createCertDto: CreateCertDto): Promise<Cert>;
    findAll(): Promise<Cert[]>;
    findOne(id: string): Promise<Cert | null>;
    remove(id: string): Promise<any>;
    uploadFile(file: Express.Multer.File): string;
}
