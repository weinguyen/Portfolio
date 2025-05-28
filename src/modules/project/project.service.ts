import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRespository: Repository<Project>,
  ) {}
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRespository.create(createProjectDto);
    return this.projectRespository.save(project);
  }
  async findAll(): Promise<Project[]> {
    return this.projectRespository.find();
  }
  async remove(id: string): Promise<any> {
    await this.projectRespository.delete(id);
    return { success: true };
  }
  uploadFile(file: Express.Multer.File): string {
    return file.path;
  }
}
