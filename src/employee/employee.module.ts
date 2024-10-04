import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AdminController } from '../employee/controllers/admin.controller';
import { EmployeeController } from '../employee/controllers/employee.controller';
import { ManagerController } from '../employee/controllers/manager.controller';
import { FirebaseModule } from 'src/firebase/firebase-module';

@Module({
  imports: [FirebaseModule],
  controllers: [
    EmployeeController,
    AdminController,
    ManagerController,
  ],
  providers: [EmployeeService]
})
export class EmployeeModule {}
