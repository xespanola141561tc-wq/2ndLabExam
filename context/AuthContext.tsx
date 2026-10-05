import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from '@/constants/api';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'accessToken';

function normalizeUser(value: unknown): User | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const firstName = typeof record.firstName === 'string' ? record.firstName : '';
  const lastName = typeof record.lastName === 'string' ? record.lastName : '';
  const name = typeof record.name === 'string'
    ? record.name
    : [firstName, lastName].filter(Boolean).join(' ');

  return {
    id: typeof record.id === 'string' || typeof record.id === 'number' ? record.id : undefined,
    name: name || undefined,
    email: typeof record.email === 'string' ? record.email : undefined,
    role: typeof record.role === 'string' ? record.role : undefined,
    image: typeof record.image === 'string' ? record.image : undefined,
  };
}

async function secureStoreAvailable() {
  return Platform.OS !== 'web' && SecureStore.isAvailableAsync();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = useCallback(async (accessToken: string, userData: User) => {
    if (await secureStoreAvailable()) {
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
    }
    setToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    if (await secureStoreAvailable()) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    setToken(null);
    setUser(null);
  }, []);

  const restoreSession = useCallback(async () => {
    setAuthLoading(true);
    try {
      if (!(await secureStoreAvailable())) {
        setToken(null);
        setUser(null);
        return;
      }

      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!savedToken) {
        setToken(null);
        setUser(null);
        return;
      }

      const response = await fetch(API_ENDPOINTS.profile, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (response.status === 401 || response.status === 403) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        setUser(null);
        return;
      }
      if (!response.ok) {
        throw new Error('Unable to restore your session. Please sign in again.');
      }

      const profile: unknown = await response.json();
      setToken(savedToken);
      setUser(normalizeUser(profile));
    } catch {
      // A network error must not crash the app; the sign-in screen remains available.
      setToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider value={{ token, user, authLoading, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}
