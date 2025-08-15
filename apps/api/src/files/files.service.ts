import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class FilesService {
  async getPresignedPut(key: string) {
    const token = crypto.randomBytes(8).toString('hex');
    return { url: `https://s3.example.com/${key}?token=${token}`, method: 'PUT' };
  }
}
