import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AdminController } from '../employee/controllers/admin.controller';
import { EmployeeController } from '../employee/controllers/employee.controller';
import { ManagerController } from '../employee/controllers/manager.controller';
import { FirebaseModule } from 'src/firebase/firebase-module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [FirebaseModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AuthModule
],
  controllers: [
    EmployeeController,
    AdminController,
    ManagerController,
  ],
  providers: [EmployeeService]
})
export class EmployeeModule {}
