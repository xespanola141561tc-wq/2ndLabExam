/* eslint-disable @typescript-eslint/no-unused-vars -- Setters and imports are reserved for exam TODOs. */
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // False keeps the unfinished starter usable; no session has been restored yet.
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (accessToken: string, userData: User) => {
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync('accessToken', accessToken);
    }
    setToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync('accessToken');
    }
    setToken(null);
    setUser(null);
  };

  const restoreSession = async () => {
    // TODO EXAM: Set authLoading while restoring the session.
    // TODO EXAM: Read the saved token with SecureStore.getItemAsync().
    // TODO EXAM: Validate the token via GET /profile with a Bearer token.
    // TODO EXAM: Update token and user state for a valid session.
    // TODO EXAM: Handle 401 Unauthorized / expired sessions and clear invalid credentials.
    // TODO EXAM: Handle errors and stop authLoading in finally.
  };

  useEffect(() => {
    // TODO EXAM: Call restoreSession() on startup.
  }, []);

  // SecureStore is native-only. The web skeleton makes no storage calls.
  // TODO EXAM: Check platform availability before storage calls; test persistence on Android/iOS.
  return (
    <AuthContext.Provider value={{ token, user, authLoading, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}
