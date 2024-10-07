import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { EmployeeService } from '../employee.service';
import { EmployeeDTO, UpdateEmployeeDto } from '../employee.dto';
import { Measure } from 'src/auth/measure.decorator';

@Controller('admin/employees')
@UseGuards(FirebaseAuthGuard)
export class AdminController {
    constructor(private employeeService: EmployeeService) {}

    private validateAdmin(user: any) {
        if (user.role !== 'admin') {
            throw new UnauthorizedException('Admin access required');
        }
    }

    @Get()
    @Measure()
    async getAllEmployees(@Req() req) {
        this.validateAdmin(req.user);
        return this.employeeService.getEmployees();
    }

    @Get(':id')
    async getEmployeeById(@Req() req, @Param('id') id: number) {
        this.validateAdmin(req.user);
        return this.employeeService.getEmployeeById(id);
    }

    @Post()
    async createEmployee(@Req() req, @Body() employee: EmployeeDTO) {
        this.validateAdmin(req.user);
        return this.employeeService.postEmployee(employee);
    }

    @Delete(':id')
    async deleteEmployee(@Req() req, @Param('id') id: number) {
        this.validateAdmin(req.user);
        return this.employeeService.deleteEmployeeById(id);
    }

    @Put(':id')
    async updateEmployee(
        @Req() req,
        @Param('id') id: number,
        @Body() updateData: UpdateEmployeeDto
    ) {
        this.validateAdmin(req.user);
        const updates = Object.entries(updateData);
        let result = null;
        
        for (const [key, value] of updates) {
            result = await this.employeeService.putEmployeeById(id, key, value);
        }
        return result;
    }
}