import * as path from 'node:path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ObjectCannedACL } from '@aws-sdk/client-s3/dist-types/models/models_0';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { v4 } from 'uuid';

import getConfig from '../../../configs/configuration';
import { EFileType } from '../enums/file-type.enum';

config({ path: '.env' });

const s3Config = getConfig().awsS3;

@Injectable()
export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: s3Config.AWS_REGION,
      credentials: {
        accessKeyId: s3Config.AWS_ACCESS_KEY,
        secretAccessKey: s3Config.AWS_SECRET_KEY,
      },
    });
  }

  public async uploadFile(
    file: Express.Multer.File,
    fileType: EFileType,
    itemId: string,
  ): Promise<string> {
    const filePath = this.buildPath(fileType, itemId, file.originalname);
    await this.client.send(
      new PutObjectCommand({
        Bucket: s3Config.AWS_BUCKET_NAME,
        Key: filePath,
        Body: file.buffer,
        ACL: s3Config.AWS_OBJECT_ACL as ObjectCannedACL,
        ContentType: file.mimetype,
      }),
    );
    return filePath;
  }

  public async deleteFile(filePath: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: s3Config.AWS_BUCKET_NAME,
        Key: filePath,
      }),
    );
  }

  private buildPath(
    itemType: EFileType,
    itemId: string,
    fileName: string,
  ): string {
    return `${itemType}/${itemId}/${v4()}${path.extname(fileName)}`;
  }
}
