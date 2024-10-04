export class EmployeeDTO{
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'employee';
    firebaseUid: string;
}

export class UpdateEmployeeDto {
    name?: string;
    email?: string;
}