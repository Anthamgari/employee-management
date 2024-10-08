import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseModule } from '../firebase/firebase-module';
import { JwtModule } from '@nestjs/jwt'; 
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
    FirebaseModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService], 
  controllers: [AuthController], 
  exports: [AuthService], 
})
export class AuthModule {}
