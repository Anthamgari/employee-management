import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Measure } from './measure.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly jwtSecret = process.env.JWT_SECRET; 

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split('Bearer ')[1]; 

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decodedToken = jwt.verify(token, this.jwtSecret) as any; 
            
            
            request['user'] = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                role: decodedToken.role || 'employee', 
            };

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
