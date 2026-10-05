import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StudentCard, { type Student } from '@/components/StudentCard';
import { API_ENDPOINTS } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

type ApiUser = {
  id?: number | string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  company?: { department?: string };
};

export default function StudentsScreen() {
  const { token, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError('');

    if (!token) {
      setStudents([]);
      setError('Please sign in to view students.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_ENDPOINTS.students}?limit=0&select=id,firstName,lastName,email,company`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 401) {
        await logout();
        return;
      }
      if (!response.ok) {
        throw new Error('Unable to load students. Please try again.');
      }

      const payload: unknown = await response.json();
      if (!payload || typeof payload !== 'object' || !('users' in payload) || !Array.isArray(payload.users)) {
        throw new Error('The server returned an invalid students response.');
      }

      const users = payload.users as ApiUser[];
      setStudents(users.map((user) => ({
        id: user.id,
        name: [user.firstName, user.lastName].filter((part): part is string => typeof part === 'string').join(' ') || user.name,
        email: user.email,
        course: user.company?.department,
      })));
    } catch (cause) {
      setStudents([]);
      setError(cause instanceof Error ? cause.message : 'Unable to load students. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const filteredStudents = students.filter((student) =>
    [student.name, student.email, student.course]
      .some((field) => (field || '').toLowerCase().includes(search.trim().toLowerCase())),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Search students"
        placeholder="Search by name"
        value={search}
        onChangeText={setSearch}
      />
      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.text}>Loading students...</Text>
        </View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void loadStudents()}>
            <Text style={styles.link}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item, index) => String(item.id ?? index)}
          renderItem={({ item }) => <StudentCard student={item} />}
          ListEmptyComponent={
            <View style={styles.state}>
              <Text style={styles.text}>
                {search.trim() ? 'No students match your search.' : 'No students are available.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f2f5fa' },
  title: { fontSize: 28, fontWeight: '700', color: '#17324d', marginBottom: 20 },
  input: { padding: 14, borderWidth: 1, borderColor: '#c6d2e1', borderRadius: 8, backgroundColor: '#ffffff', color: '#17324d', marginBottom: 20 },
  state: { padding: 24, gap: 12, alignItems: 'center' },
  text: { color: '#536579' },
  error: { color: '#b42318' },
  link: { color: '#245bb2', padding: 12 },
});
