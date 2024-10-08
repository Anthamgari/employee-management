import { Controller, Get, Post, Put, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/firebase-auth.guard';
import { EmployeeService } from '../employee.service';
import { EmployeeDTO, UpdateEmployeeDto } from '../employee.dto';
import { Measure } from 'src/auth/measure.decorator';

@Controller('manager/employees')
@UseGuards(JwtAuthGuard)
export class ManagerController {
    constructor(private employeeService: EmployeeService) {}

    private validateManager(user: any) {
        if (!['admin', 'manager'].includes(user.role)) {
            throw new UnauthorizedException('Manager access required');
        }
    }

    @Get()
    @Measure()
    async getAllEmployees(@Req() req) {
        this.validateManager(req.user);
        return this.employeeService.getEmployees();
    }

    @Get(':id')
    async getEmployeeById(@Req() req, @Param('id') id: number) {
        this.validateManager(req.user);
        return this.employeeService.getEmployeeById(id);
    }

    @Post()
    @Measure()
    async createEmployee(@Req() req, @Body() employee: EmployeeDTO) {
        this.validateManager(req.user);
        return this.employeeService.postEmployee(employee);
    }

    @Put(':id')
    async updateEmployee(
        @Req() req,
        @Param('id') id: number,
        @Body() updateData: UpdateEmployeeDto
    ) {
        this.validateManager(req.user);
        const updates = Object.entries(updateData);
        let result = null;
        
        for (const [key, value] of updates) {
            result = await this.employeeService.putEmployeeById(id, key, value);
        }
        return result;
    }
}