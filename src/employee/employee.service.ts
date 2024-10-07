import { Injectable, HttpException } from '@nestjs/common';
import { EMPLOYEES } from './Employee.Mock';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/user.schema';


@Injectable()
export class EmployeeService
{
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    public async getEmployees()
    {
        return await this.userModel.find().exec();
    }

    public  async postEmployee(employee)
    {
        const newEmployee = new this.userModel(employee);
        return await newEmployee.save();
    }

    public async getEmployeeById(id: number) : Promise<any>
    {
        {
            const employee = await this.userModel.findById(id).exec();
            if(!employee)
            {
                 throw new HttpException("Not Found", 404);
    
            }
            return employee;
        };
    }

    public  async deleteEmployeeById(id: number) : Promise<any>
    {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new HttpException("Not Found", 404);
        }
        return { message: 'Employee deleted successfully' };
    }

    public async putEmployeeById(id:number, propertyName: string, propertyValue: string) : Promise<any>
    {
        const updatedEmployee = await this.userModel.findByIdAndUpdate(id, { [propertyName]: propertyValue }, { new: true }).exec();
        if (!updatedEmployee) {
            throw new HttpException("Not Found", 404);
        }
        return updatedEmployee;
    }
}


