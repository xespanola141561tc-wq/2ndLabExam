import { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function StudentDetailsScreen() {
  const { id: routeId } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(routeId) ? routeId[0] : routeId;
  const router = useRouter();
  const { token } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudent() {
      setStudent(null);
      setError('');

      if (!id || !/^\d+$/.test(id)) {
        setError('Invalid student ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new Error('Your session has expired. Please sign in again.');
        }
        if (response.status === 404) {
          throw new Error('Student not found.');
        }
        if (!response.ok) {
          throw new Error('Unable to load student details. Please try again.');
        }

        const payload: unknown = await response.json();
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
          throw new Error('The server returned an invalid student record.');
        }

        const record = payload as Record<string, unknown>;
        const name = typeof record.name === 'string'
          ? record.name
          : [record.firstName, record.lastName]
              .filter((part): part is string => typeof part === 'string')
              .join(' ');

        setStudent({
          id: typeof record.id === 'string' || typeof record.id === 'number' ? record.id : id,
          name,
          email: typeof record.email === 'string' ? record.email : undefined,
          course: typeof record.course === 'string' ? record.course : undefined,
        });
      } catch (cause) {
        if (controller.signal.aborted) return;
        setStudent(null);
        setError(cause instanceof Error ? cause.message : 'Unable to load student details.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadStudent();
    return () => controller.abort();
  }, [id, token]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Details</Text>
      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.text}>Loading student...</Text>
        </View>
      ) : error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>
      ) : student ? (
        <View style={styles.card}>
          <Text style={styles.text}>ID: {student.id ?? id}</Text>
          <Text style={styles.text}>Name: {student.name || 'Not available'}</Text>
          <Text style={styles.text}>Email: {student.email || 'Not available'}</Text>
          <Text style={styles.text}>Course: {student.course || 'Not available'}</Text>
        </View>
      ) : (
        <Text style={styles.text}>No student record available.</Text>
      )}
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 28, fontWeight: '700' },
  state: { gap: 12, alignItems: 'center' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
