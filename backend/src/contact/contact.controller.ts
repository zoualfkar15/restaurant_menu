import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
@UseGuards(ThrottlerGuard)
export class ContactController {
  constructor(private contact: ContactService) {}

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contact.create(dto);
  }
}
