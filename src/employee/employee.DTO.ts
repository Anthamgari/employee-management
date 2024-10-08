import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum UserRole {
    Admin = 'admin',
    Manager = 'manager',
    Employee = 'employee',
}
 
export class EmployeeDTO{
    @IsOptional()
    id: number;

    @IsEmail()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;
    
    @IsString()
    password: string;
}


export class UpdateEmployeeDto {
    @IsOptional()
    name?: string;
    
    @IsOptional()
    email?: string;
}