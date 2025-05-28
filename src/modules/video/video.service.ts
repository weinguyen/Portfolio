/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import axios from 'axios';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const data = await this.crawDataTikTok(createVideoDto.link);

    const video = this.videoRepository.create({
      link: createVideoDto.link,
      play_count: data.play_count,
      like_count: data.digg_count,
      comment_count: data.comment_count,
      share_count: data.share_count,
      download_count: data.download_count,
      collect_count: data.collect_count,
    });

    return await this.videoRepository.save(video);
  }

  async findAll(): Promise<Video[]> {
    return await this.videoRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.videoRepository.delete(id);
  }

  async crawDataTikTok(link: string): Promise<any> {
    const url = `https://tiktok-scraper7.p.rapidapi.com/?url=${encodeURIComponent(link)}`;

    const options = {
      headers: {
        'X-RapidAPI-Key': '55d57e6be6mshd8eb374391cbeb5p11dfe5jsn46cbd96cb19f',
        'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
      },
    };

    const response = await axios.get(url, options);
    console.log(response.data.data);
    return response.data.data;
  }
  async remove_all(): Promise<void> {
    await this.videoRepository.clear();
  }
}
