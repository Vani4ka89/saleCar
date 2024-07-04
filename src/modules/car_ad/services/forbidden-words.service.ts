import { Injectable } from '@nestjs/common';
import { illegalWords } from '../constants/illegal-words';

@Injectable()
export class ForbiddenWordsService {
  private readonly forbiddenWords = illegalWords;

  public async checkForbiddenWords(text: string): Promise<boolean> {
    const incomeText = text.toLowerCase();
    return this.forbiddenWords.some((word) => incomeText.includes(word));
  }
}
