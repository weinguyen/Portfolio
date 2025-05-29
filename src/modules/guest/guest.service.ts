import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateGuestDto } from './dto/create-guest.dto';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    private readonly mailerService: MailerService,
  ) {}
  async create(createGuestDto: CreateGuestDto): Promise<any> {
    const guest = this.guestRepository.create(createGuestDto);
    await this.guestRepository.save(guest);
    return await this.sendEmail(createGuestDto);
  }

  async findAll(): Promise<Guest[]> {
    return this.guestRepository.find();
  }
  async remove(id: string): Promise<any> {
    await this.guestRepository.delete(id);
    return { success: true };
  }
  async sendEmail(createGuestDto: CreateGuestDto): Promise<any> {
    const { name, email, phone, message } = createGuestDto;

    await this.mailerService.sendMail({
      to: 'dothanhphuc1402@gmail.com',
      subject: `Tin nhắn từ Web Portfolio gửi đến Phúc`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #2e7d32;">📬 Bạn có một tin nhắn mới!</h2>
        <p><strong>👤Tên:</strong> ${name}</p>
        <p><strong>📧 Email:</strong> ${email}</p>
        <p><strong>📱 Số điện thoại:</strong> ${phone}</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #2e7d32;">
          <p style="margin: 0; white-space: pre-line;">${message}</p>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">Email này được gửi tự động từ hệ thống.</p>
      </div>
    `,
    });

    return { success: true };
  }
}
