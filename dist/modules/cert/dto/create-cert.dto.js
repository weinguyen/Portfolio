"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCertDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const cert_entity_1 = require("../entities/cert.entity");
class CreateCertDto extends (0, swagger_1.OmitType)(cert_entity_1.Cert, ['id']) {
}
exports.CreateCertDto = CreateCertDto;
//# sourceMappingURL=create-cert.dto.js.map