import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.config';
import { User } from '@supabase/supabase-js';

// Extend the Request type to include a user property for better type safety

declare global {
  namespace Express {
    interface Request {
      user?: User; // Using Supabase's User type
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  
  const authHeader = req.headers['authorization']; 
  
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Supabase authentication error:', error.message);
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Error during token authentication:', err);
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};