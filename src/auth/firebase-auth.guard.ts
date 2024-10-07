import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Measure } from './measure.decorator';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {}
    @Measure()
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
            request['user'] = {
                ...decodedToken,
                role: decodedToken.role || 'employee'
            };
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}