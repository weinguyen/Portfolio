import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorators/public.decorator';
import { CertService } from './cert.service';
import { CreateCertDto } from './dto/create-cert.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('cert')
export class CertController {
  constructor(private readonly certService: CertService) {}
  @Post()
  create(@Body() createCertDto: CreateCertDto) {
    return this.certService.create(createCertDto);
  }
  @Public()
  @Get()
  findall() {
    return this.certService.findAll();
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.certService.uploadFile(file);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certService.remove(id);
  }
}
