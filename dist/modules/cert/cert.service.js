"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const cert_entity_1 = require("./entities/cert.entity");
const typeorm_2 = require("@nestjs/typeorm");
const fs = require("fs");
const path = require("path");
let CertService = class CertService {
    certRepository;
    constructor(certRepository) {
        this.certRepository = certRepository;
    }
    async create(createCertDto) {
        const cert = this.certRepository.create(createCertDto);
        return this.certRepository.save(cert);
    }
    async findAll() {
        return this.certRepository.find();
    }
    async findOne(id) {
        return this.certRepository.findOneById(id);
    }
    async remove(id) {
        const cert = await this.certRepository.findOneById(id);
        if (cert?.image) {
            const isUrl = cert.image.startsWith('http://') || cert.image.startsWith('https://');
            if (!isUrl) {
                const filepath = path.join(__dirname, '..', '..', '..', cert.image);
                try {
                    await fs.promises.unlink(filepath);
                }
                catch (error) {
                    console.error('Image file not found:', error);
                }
            }
        }
        await this.certRepository.delete(id);
        return { success: true };
    }
    uploadFile(file) {
        return file.path;
    }
};
exports.CertService = CertService;
exports.CertService = CertService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(cert_entity_1.Cert)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CertService);
//# sourceMappingURL=cert.service.js.map