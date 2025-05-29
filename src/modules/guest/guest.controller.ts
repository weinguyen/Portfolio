import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { GuestService } from './guest.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
@ApiBearerAuth()
@Controller('guest')
export class GuestController {
  constructor(private readonly GuestService: GuestService) {}
  @Public()
  @Throttle({
    default: {
      limit: 20,
      ttl: 60,
    },
  })
  @Post()
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.GuestService.create(createGuestDto);
  }
  @Get()
  findall() {
    return this.GuestService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.GuestService.remove(id);
  }
}
