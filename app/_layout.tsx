// @ts-ignore - AuthContext is a TSX module; the project config in this workspace does not include JSX.
import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  // TODO EXAM: Check authentication state and wait for session restoration.
  // TODO EXAM: Protect (app) AND student/[id]; redirect unauthenticated users to /sign-in.
  return (
    <AuthProvider>
      <Stack initialRouteName="(app)" screenOptions={{ headerTintColor: '#17324d' }}>
        <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="student/[id]" options={{ title: 'Student Details' }} />
      </Stack>
    </AuthProvider>
  );
}
