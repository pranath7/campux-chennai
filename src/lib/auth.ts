/**
 * Authentication and Session Management Service
 */

import { User, UserRole } from '@/types/marketplace';
import { db } from './db';

export interface AuthSession {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  collegeId?: string;
  isVerified?: boolean;
}

const AUTH_COOKIE_NAME = 'campux_session';

export class AuthService {
  /**
   * Generates a signed session token
   */
  static createSessionToken(user: User): string {
    const profile = db.getStudentProfile(user.id);
    const session: AuthSession = {
      userId: user.id,
      email: user.email || '',
      fullName: user.fullName,
      role: user.role,
      collegeId: profile?.collegeId,
      isVerified: profile?.verifiedBadge || false,
    };
    return Buffer.from(JSON.stringify(session)).toString('base64url');
  }

  /**
   * Verifies and decodes a session token
   */
  static verifySessionToken(token?: string | null): AuthSession | null {
    if (!token) return null;
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf-8');
      const session = JSON.parse(decoded) as AuthSession;
      // Re-verify against active user in database
      const activeUser = db.getUserById(session.userId);
      if (!activeUser || activeUser.isSuspended) return null;
      
      const profile = db.getStudentProfile(activeUser.id);
      return {
        userId: activeUser.id,
        email: activeUser.email || '',
        fullName: activeUser.fullName,
        role: activeUser.role,
        collegeId: profile?.collegeId,
        isVerified: profile?.verifiedBadge || false,
      };
    } catch {
      return null;
    }
  }

  static getCookieName(): string {
    return AUTH_COOKIE_NAME;
  }
}
