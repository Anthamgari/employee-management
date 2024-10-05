import { IsOptional } from 'class-validator';
export class EmployeeDTO{
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'employee';
    firebaseUid: string;
}

export class UpdateEmployeeDto {
    @IsOptional()
    name?: string;
    
    @IsOptional()
    email?: string;
}