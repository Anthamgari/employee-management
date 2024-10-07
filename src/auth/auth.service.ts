import { Injectable, Inject } from '@nestjs/common';
import { RegisterUserDto, LoginUserDto, VerifyOtpDto } from './auth.dto';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as admin from 'firebase-admin'; 
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';



@Injectable()
export class AuthService {
  private otpStore = new Map<string, string>();
  private jwtSecret = process.env.JWT_SECRET;

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // Inject the User model
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, role } = registerUserDto;

    try {
      const userRecord = await this.firebaseAdmin.auth().createUser({
        email,
        password,

      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new this.userModel({ email, password: hashedPassword, role });
      await user.save();

      const otp = crypto.randomBytes(3).toString('hex');
      this.otpStore.set(email, otp);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'akhilreddyanthamgari@gmail.com',
          pass: "duppwitycqgzmsig",
        },
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`,
      });

      return { message: 'User registered. Please verify OTP sent to email.' };
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    const storedOtp = this.otpStore.get(email);

    if (storedOtp && storedOtp === otp) {
      this.otpStore.delete(email); 

      const user = await this.userModel.findOne({ email });
      if (user) {
        user.emailVerified = true;
        await user.save();
      }

      return { message: 'Email verified successfully.' };
    } else {
      throw new Error('Invalid OTP.');
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new Error('User not found.');
      }

      if (!user.emailVerified) {
        throw new Error('Email not verified.');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Invalid credentials.');
      }

      const jwtToken = this.generateJwt({
        uid: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return {
        message: 'Login successful.',
        jwtToken,
        user: { email: user.email },
      };
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  }

  private generateJwt(payload: { uid: string; email: string; role: string  }) {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }

  async validateJwt(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}