import { IsOptional } from "class-validator";

export class RegisterUserDto {
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  role: 'admin' | 'manager' | 'employee';
}

export class VerifyOtpDto {
  @IsOptional()
  email: string;

  @IsOptional()
  otp: string;
}

export class LoginUserDto {
  @IsOptional()
  email: string;
  @IsOptional()
  password: string;
}
