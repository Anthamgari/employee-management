import { Controller, Get, Put, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { EmployeeService } from '../employee.service';
import { UpdateEmployeeDto } from '../employee.dto';

@Controller('employees')
@UseGuards(FirebaseAuthGuard)
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}

    @Get()
    async getOwnData(@Req() req) {
        const employees = await this.employeeService.getEmployees();
        const ownData = employees.find((emp) => emp.firebaseUid === req.user.uid);
        if (!ownData) {
            throw new UnauthorizedException('Employee not found');
        }
        return ownData;
    }

    @Put()
    async updateOwnData(
        @Req() req,
        @Body() updateData: UpdateEmployeeDto
    ) {
        const employees = await this.employeeService.getEmployees();
        const employee = employees.find(emp => emp.firebaseUid === req.user.uid);
        
        if (!employee) {
            throw new UnauthorizedException('Employee not found');
        }

        const updates = Object.entries(updateData);
        let result = null;
        
        for (const [key, value] of updates) {
            result = await this.employeeService.putEmployeeById(employee.id, key, value);
        }
        return result;
    }
}