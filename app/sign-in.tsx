import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_BASE_URL } from '@/constants/api';
import type { User } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

type LoginResponse = {
  accessToken?: unknown;
  user?: unknown;
  message?: unknown;
  id?: unknown;
  username?: unknown;
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
};

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const normalizedUsername = username.trim();

    if (!normalizedUsername || !password) {
      setError('Enter your username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalizedUsername, password }),
      });

      let payload: LoginResponse;
      try {
        payload = (await response.json()) as LoginResponse;
      } catch {
        throw new Error('The server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(typeof payload.message === 'string' ? payload.message : 'Unable to sign in.');
      }

      if (typeof payload.accessToken !== 'string') {
        throw new Error('The API returned an invalid login response.');
      }

      const apiUser = payload.user && typeof payload.user === 'object'
        ? payload.user as Record<string, unknown>
        : payload;
      const firstName = typeof apiUser.firstName === 'string' ? apiUser.firstName : '';
      const lastName = typeof apiUser.lastName === 'string' ? apiUser.lastName : '';
      const name = [firstName, lastName].filter(Boolean).join(' ') || normalizedUsername;
      const user: User = {
        id: typeof apiUser.id === 'string' || typeof apiUser.id === 'number' ? apiUser.id : undefined,
        name,
        email: typeof apiUser.email === 'string' ? apiUser.email : undefined,
      };

      await login(payload.accessToken, user);
      setPassword('');
      router.replace('/(app)');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.eyebrow}>CCE106 • PRACTICAL EXAMINATION</Text>
        <Text style={styles.title}>Student Service Portal</Text>
        <Text style={styles.subtitle}>Sign in to access student services.</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Username"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.feedback} accessibilityLiveRegion="polite">
          {loading && <ActivityIndicator color="#245bb2" accessibilityLabel="Signing in" />}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Pressable accessibilityRole="button" style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Login'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f2f5fa' },
  card: { width: '100%', maxWidth: 440, alignSelf: 'center', padding: 24, borderRadius: 16, backgroundColor: '#ffffff' },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#245bb2', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#17324d' },
  subtitle: { color: '#536579', marginTop: 8, marginBottom: 24 },
  label: { color: '#17324d', fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#c6d2e1', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 16, color: '#17324d' },
  feedback: { minHeight: 28 },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700' },
});
