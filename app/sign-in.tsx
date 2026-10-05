import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const normalizedUsername = username.trim();

    if (!normalizedUsername || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    setError('');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalizedUsername, password }),
        signal: controller.signal,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'Unable to sign in.');
      }

      const sessionUser = payload?.user ?? {
        id: payload?.userId ?? payload?.id,
        name: payload?.username ?? normalizedUsername,
        role: payload?.role ?? 'student',
      };

      login(payload?.token, {
        id: sessionUser.id,
        name: sessionUser.name ?? normalizedUsername,
        role: sessionUser.role ?? 'student',
      });

      setPassword('');
      router.replace('/(app)');
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name === 'AbortError'
          ? 'Login timed out. Check your internet connection and try again.'
          : cause instanceof Error
            ? cause.message
            : 'Unable to sign in. Check your connection and try again.'
      );
    } finally {
      clearTimeout(timeoutId);
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
          placeholder="emilys"
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

        <Text style={styles.note}>Demo credentials: emilys / emilyspass</Text>
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
  note: { color: '#536579', fontSize: 12, marginTop: 20 },
});