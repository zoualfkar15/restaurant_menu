import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController, FilesController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
