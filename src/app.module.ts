import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { FirebaseModule } from './firebase/firebase-module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/employeeDatabase'),
    EmployeeModule,
    FirebaseModule,
    AuthModule
  ],
})
export class AppModule {}
