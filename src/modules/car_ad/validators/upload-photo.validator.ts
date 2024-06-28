import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const validators = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 100000 }),
    new FileTypeValidator({ fileType: 'image/jpeg' }),
  ],
});
