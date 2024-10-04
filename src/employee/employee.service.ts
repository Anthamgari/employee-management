import { Injectable, HttpException } from '@nestjs/common';
import { EMPLOYEES } from './Employee.Mock';
import { resolve } from 'path';

@Injectable()
export class EmployeeService
{
    private employees = EMPLOYEES;

    public  getEmployees()
    {
        return this.employees;
    }

    public  postEmployee(employee)
    {
        return this.employees.push(employee)
    }

    public  getEmployeeById(id: number) : Promise<any>
    {
        const EmployeeId = Number(id)
        return new Promise((resolve) => 
        {
            const employee = this.employees.find((employee) => employee.id === EmployeeId)
            if(!employee)
            {
                 throw new HttpException("Not Found", 404);
    
            }
            return resolve(employee);
        });
    }

    public  deleteEmployeeById(id: number) : Promise<any>
    {
        const EmployeeId = Number(id)
        return new Promise((resolve) =>
        {
        const index = this.employees.findIndex((employee) => employee.id === EmployeeId)
        if(index === -1)
            {
             throw new HttpException("Not Found", 404);
            }
        this.employees.splice(index,1);
        return resolve(this.employees)
        });
    }

    public  putEmployeeById(id:number, propertyName: string, propertyValue: string) : Promise<any>
    {
        const EmployeeId = Number(id)
        return new Promise((resolve) =>
        {
            const index = this.employees.findIndex((employee)=>employee.id===EmployeeId);
            if(index === -1)
            {
            throw new HttpException("Not Found", 404);
            }
            this.employees[index][propertyName] = propertyValue 
            return resolve(this.employees[index])
        });
    }
}


