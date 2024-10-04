import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { FirebaseModule } from './firebase/firebase-module';

@Module({
  imports: [
    EmployeeModule,
    FirebaseModule
  ],
})
export class AppModule {}
