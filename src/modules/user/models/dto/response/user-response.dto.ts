export class UserResponseDto {
  userId: string;
  name: string;
  email: string;
  role: string;
  accountType: string;
  image: string;
  banned: boolean;
  banReason: string;
}

export class UserResponseAllDto {
  data: UserResponseDto[];
}
