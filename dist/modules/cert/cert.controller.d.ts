import { CertService } from './cert.service';
import { CreateCertDto } from './dto/create-cert.dto';
export declare class CertController {
    private readonly certService;
    constructor(certService: CertService);
    create(createCertDto: CreateCertDto): Promise<import("./entities/cert.entity").Cert>;
    findall(): Promise<import("./entities/cert.entity").Cert[]>;
    uploadFile(file: Express.Multer.File): string;
    remove(id: string): Promise<any>;
}
