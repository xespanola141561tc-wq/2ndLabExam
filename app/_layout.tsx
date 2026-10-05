import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { Redirect, Stack, useSegments } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

function RootNavigator() {
  const { token, authLoading } = useAuth();
  const segments = useSegments();
  const isOnSignIn = segments[0] === 'sign-in';

  if (authLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#245bb2" />
      </View>
    );
  }

  if (!token && !isOnSignIn) {
    return <Redirect href="/sign-in" />;
  }

  if (token && isOnSignIn) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerTintColor: '#17324d' }}>
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="student/[id]" options={{ title: 'Student Details' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
