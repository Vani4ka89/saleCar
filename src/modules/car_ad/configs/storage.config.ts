import { extname } from 'node:path';

import { diskStorage } from 'multer';

export const storageConfigs = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
