import { ITokenPair } from '../../../types/token.type';
import { TokenResponseDto } from './token-response.dto';

export class SignUpResponseDto {
  userId: string;
  name: string;
  email: string;
  role: string;
  accountType: string;
  image: string;
}

export class SignInResponseDto {
  userId: string;
  tokens: TokenResponseDto;
}
