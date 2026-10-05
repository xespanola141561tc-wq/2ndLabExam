import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_ENDPOINTS } from '@/constants/api';
import type { User } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

type LoginPayload = {
  accessToken?: unknown;
  token?: unknown;
  id?: unknown;
  username?: unknown;
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  role?: unknown;
  image?: unknown;
  message?: unknown;
};

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateUsername = (value: string) => {
    setUsername(value);
    setError('');
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    setError('');
  };

  const handleLogin = async () => {
    const normalizedUsername = username.trim();
    if (!normalizedUsername || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    setError('');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalizedUsername, password }),
        signal: controller.signal,
      });

      let payload: LoginPayload;
      try {
        payload = (await response.json()) as LoginPayload;
      } catch {
        throw new Error('The server returned an invalid response.');
      }
      if (!response.ok) {
        throw new Error(typeof payload.message === 'string' ? payload.message : 'Unable to sign in.');
      }

      const accessToken = typeof payload.accessToken === 'string'
        ? payload.accessToken
        : typeof payload.token === 'string' ? payload.token : null;
      if (!accessToken) throw new Error('The API response did not include an access token.');

      const firstName = typeof payload.firstName === 'string' ? payload.firstName : '';
      const lastName = typeof payload.lastName === 'string' ? payload.lastName : '';
      const user: User = {
        id: typeof payload.id === 'string' || typeof payload.id === 'number' ? payload.id : undefined,
        name: [firstName, lastName].filter(Boolean).join(' ') || normalizedUsername,
        email: typeof payload.email === 'string' ? payload.email : undefined,
        role: typeof payload.role === 'string' ? payload.role : undefined,
        image: typeof payload.image === 'string' ? payload.image : undefined,
      };

      await login(accessToken, user);
      setPassword('');
      router.replace('/(app)');
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name === 'AbortError'
          ? 'Login timed out. Check your internet connection and try again.'
          : cause instanceof Error
            ? cause.message
            : 'Unable to sign in. Check your connection and try again.',
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
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>SS</Text></View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandName}>STUDENT PORTAL</Text>
            <Text style={styles.brandSub}>CCE106 · PRACTICAL EXAM</Text>
          </View>
        </View>
        <Text style={styles.title}>Student Service Portal</Text>
        <Text style={styles.subtitle}>Welcome back. Sign in to continue to your student services.</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Username"
          placeholder="emilys"
          placeholderTextColor="#9aa7b8"
          value={username}
          onChangeText={updateUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Password"
          placeholder="Enter your password"
          placeholderTextColor="#9aa7b8"
          value={password}
          onChangeText={updatePassword}
          secureTextEntry
        />
        <View style={styles.feedback} accessibilityLiveRegion="polite">
          {loading && <ActivityIndicator color="#245bb2" accessibilityLabel="Signing in" />}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Pressable accessibilityRole="button" style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Login'}</Text>
        </Pressable>
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>DEMO ACCOUNT</Text>
          <Text style={styles.note}>Username  <Text style={styles.credential}>emilys</Text></Text>
          <Text style={styles.note}>Password  <Text style={styles.credential}>emilyspass</Text></Text>
        </View>
      </View>
      <Text style={styles.footer}>SECURE STUDENT ACCESS</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 22, backgroundColor: '#f3f6fb' },
  card: { width: '100%', maxWidth: 460, alignSelf: 'center', padding: 25, borderRadius: 24, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e7edf5', shadowColor: '#1c3554', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 3 },
  eyebrow: { display: 'none' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  brandMark: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#e8f0ff' },
  brandMarkText: { color: '#245bb2', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  brandCopy: { gap: 4 },
  brandName: { color: '#17324d', fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  brandSub: { color: '#7790b0', fontSize: 10, fontWeight: '700', letterSpacing: 0.7 },
  title: { fontSize: 29, lineHeight: 35, fontWeight: '800', letterSpacing: -0.6, color: '#142d49' },
  subtitle: { color: '#728198', fontSize: 14, lineHeight: 21, marginTop: 7, marginBottom: 25 },
  label: { color: '#263d59', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#dfe7f1', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 13, fontSize: 15, marginBottom: 17, color: '#17324d', backgroundColor: '#fbfcfe' },
  feedback: { minHeight: 28, justifyContent: 'center' },
  error: { color: '#a52a23', backgroundColor: '#fff0ee', borderRadius: 9, paddingHorizontal: 11, paddingVertical: 9, fontSize: 12, overflow: 'hidden' },
  button: { backgroundColor: '#245bb2', padding: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#245bb2', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  buttonText: { color: '#ffffff', fontWeight: '800', fontSize: 15 },
  demoBox: { marginTop: 22, padding: 14, borderRadius: 13, backgroundColor: '#f5f8fc', borderWidth: 1, borderColor: '#edf1f6', gap: 4 },
  demoTitle: { color: '#8492a6', fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginBottom: 3 },
  note: { color: '#718096', fontSize: 12, lineHeight: 18 },
  credential: { color: '#334c6b', fontWeight: '700' },
  footer: { color: '#a0aabc', fontSize: 9, fontWeight: '700', letterSpacing: 1.3, marginTop: 18 },
});
