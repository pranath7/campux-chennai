'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, College, NotificationItem } from '@/types/marketplace';

interface AuthContextType {
  user: (User & { profile?: StudentProfile; college?: College }) | null;
  loading: boolean;
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: unknown) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  markNotifAsRead: (id: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  notifications: [],
  unreadNotifsCount: 0,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshSession: async () => {},
  markNotifAsRead: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { profile?: StudentProfile; college?: College }) | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('campux_user_cache');
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshSession = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('campux_user_cache', JSON.stringify(data.user));
        }
      } else {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('campux_user_cache');
        }
      }
    } catch {
      // Keep cached user if offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('campux_user_cache', JSON.stringify(data.user));
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (formData: unknown) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('campux_user_cache', JSON.stringify(data.user));
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('campux_user_cache');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markNotifAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        notifications,
        unreadNotifsCount: notifications.filter((n) => !n.isRead).length,
        login,
        register,
        logout,
        refreshSession,
        markNotifAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
