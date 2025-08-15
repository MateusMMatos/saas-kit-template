import { Injectable } from '@nestjs/common';

type Channel = 'email'|'sms'|'whatsapp';
interface Message { to: string; template: string; vars?: Record<string,string>; }

@Injectable()
export class NotificationsService {
  async send(_ch: Channel, _msg: Message) { return { ok: true }; }
}
