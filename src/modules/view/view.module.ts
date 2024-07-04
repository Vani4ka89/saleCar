import { Module } from '@nestjs/common';
import { ViewService } from './services/view.service';

@Module({
  providers: [ViewService],
  exports: [ViewService],
})
export class ViewModule {}
