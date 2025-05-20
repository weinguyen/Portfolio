"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertModule = void 0;
const common_1 = require("@nestjs/common");
const cert_controller_1 = require("./cert.controller");
const typeorm_1 = require("@nestjs/typeorm");
const cert_entity_1 = require("./entities/cert.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const cert_service_1 = require("./cert.service");
let CertModule = class CertModule {
};
exports.CertModule = CertModule;
exports.CertModule = CertModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cert_entity_1.Cert]),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads',
                    filename: (req, file, cb) => {
                        const filename = `${Date.now()}-${file.originalname}`;
                        cb(null, filename);
                    },
                }),
            }),
        ],
        controllers: [cert_controller_1.CertController],
        providers: [cert_service_1.CertService],
    })
], CertModule);
//# sourceMappingURL=cert.module.js.map