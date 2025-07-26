import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../models/user.model';

interface IAuthRequest extends Request {
    user?: any;
}

export const protect = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: 'Not authorized to access this route' 
            });
        }

        try {
            // Verify token
            const decoded: any = verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
            req.user = await User.findById(decoded.id);
            next();
        } catch (err) {
            return res.status(401).json({ 
                success: false, 
                error: 'Not authorized to access this route' 
            });
        }
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles: string[]) => {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
