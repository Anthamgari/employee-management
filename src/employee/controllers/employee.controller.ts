import { Controller, Get, Put, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/firebase-auth.guard';
import { EmployeeService } from '../employee.service';
import { UpdateEmployeeDto } from '../employee.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}

    @Get()
    async getOwnData(@Req() req) {
        const employee = await this.employeeService.getEmployeeById(req.user.uid);
        if (!employee) {
            throw new UnauthorizedException('Employee not found');
        }
        return employee;
    }

    @Put()
    async updateOwnData(
        @Req() req,
        @Body() updateData: UpdateEmployeeDto
    ) {
        const employee = await this.employeeService.getEmployeeById(req.user.uid);
        
        if (!employee) {
            throw new UnauthorizedException('Employee not found');
        }

        const updates = Object.entries(updateData);
        let result = null;
        
        for (const [key, value] of updates) {
            await this.employeeService.putEmployeeById(employee._id.toString(), key, value);
        }
        return await this.employeeService.getEmployeeById(employee._id.toString());
    }
}