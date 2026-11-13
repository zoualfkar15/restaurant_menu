import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private contact;
    constructor(contact: ContactService);
    create(dto: CreateContactDto): Promise<{
        ok: boolean;
        id: string;
    }>;
}
