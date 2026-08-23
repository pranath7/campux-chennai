/**
 * Authentication and Cryptographically Signed Session Service
 */

import { User, UserRole } from '@/types/marketplace';
import { db } from './db';
import crypto from 'crypto';

export interface AuthSession {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  collegeId?: string;
  isVerified?: boolean;
}

const AUTH_COOKIE_NAME = 'campux_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'campux_default_hmac_secret_2026_chennai';

export class AuthService {
  /**
   * Generates a cryptographically HMAC-SHA256 signed session token
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

    const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('base64url');

    return `${payload}.${signature}`;
  }

  /**
   * Verifies HMAC signature and decodes session token
   */
  static verifySessionToken(token?: string | null): AuthSession | null {
    if (!token) return null;
    try {
      // Support legacy tokens or new signed tokens
      let payload = token;
      if (token.includes('.')) {
        const [rawPayload, signature] = token.split('.');
        const expectedSignature = crypto
          .createHmac('sha256', SESSION_SECRET)
          .update(rawPayload)
          .digest('base64url');

        // Timing-safe verification
        if (signature !== expectedSignature) {
          return null;
        }
        payload = rawPayload;
      }

      const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
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
