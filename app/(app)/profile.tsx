import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { API_ENDPOINTS } from '@/constants/api';
import type { User } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

function toUser(value: unknown): User {
  const data = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const firstName = typeof data.firstName === 'string' ? data.firstName : '';
  const lastName = typeof data.lastName === 'string' ? data.lastName : '';
  return {
    id: typeof data.id === 'number' || typeof data.id === 'string' ? data.id : undefined,
    name: typeof data.name === 'string' ? data.name : [firstName, lastName].filter(Boolean).join(' '),
    email: typeof data.email === 'string' ? data.email : undefined,
    role: typeof data.role === 'string' ? data.role : undefined,
    image: typeof data.image === 'string' ? data.image : undefined,
  };
}

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(API_ENDPOINTS.profile, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (response.status === 401 || response.status === 403) {
          await logout();
          return;
        }
        const payload: unknown = await response.json();
        if (!response.ok) {
          const message = payload && typeof payload === 'object' && 'message' in payload
            && typeof payload.message === 'string' ? payload.message : 'Unable to load your profile.';
          throw new Error(message);
        }
        if (!controller.signal.aborted) setProfile(toUser(payload));
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'Unable to load your profile.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    if (token) void loadProfile();
    return () => controller.abort();
  }, [token, logout]);

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
    } catch {
      setError('Could not clear the saved session. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>ACCOUNT</Text>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.subtitle}>Your account information and session.</Text>
      </View>
      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.note}>Loading profile…</Text>
        </View>
      ) : null}
      {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}
      <View style={styles.card}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile?.name || user?.name || 'S').split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.name}>{profile?.name || user?.name || 'Student'}</Text>
            <Text style={styles.email}>{profile?.email || user?.email || 'Email not available'}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{profile?.role || user?.role || 'Not available'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Account status</Text>
          <View style={styles.status}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{token ? 'Active session' : 'Signed out'}</Text>
          </View>
        </View>
      </View>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => void handleLogout()}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, width: '100%', maxWidth: 640, alignSelf: 'center', padding: 22, gap: 18, backgroundColor: '#f3f6fb' },
  heading: { gap: 5, marginBottom: 4 },
  eyebrow: { color: '#4674bd', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: '#142d49', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: '#728198', fontSize: 14, lineHeight: 20 },
  state: { alignItems: 'center', gap: 8, padding: 16 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#e8edf4', shadowColor: '#1c3554', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5efff' },
  avatarText: { color: '#245bb2', fontSize: 20, fontWeight: '800' },
  identityText: { flex: 1, gap: 4 },
  name: { color: '#17324d', fontSize: 19, fontWeight: '700' },
  email: { color: '#718096', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#edf1f6', marginVertical: 18 },
  infoRow: { minHeight: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#f0f3f7' },
  label: { color: '#7d8ba0', fontSize: 13, fontWeight: '600' },
  value: { color: '#263d59', fontSize: 14, fontWeight: '700' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#eaf7ef', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#28a261' },
  statusText: { color: '#267a4a', fontSize: 12, fontWeight: '700' },
  note: { color: '#536579', fontSize: 13 },
  error: { color: '#a52a23', backgroundColor: '#fff0ee', borderRadius: 10, padding: 12, overflow: 'hidden' },
  button: { backgroundColor: '#fff3f2', borderColor: '#f4d7d4', borderWidth: 1, padding: 15, borderRadius: 13, alignItems: 'center' },
  buttonText: { color: '#b33e36', fontWeight: '700', fontSize: 15 },
});
