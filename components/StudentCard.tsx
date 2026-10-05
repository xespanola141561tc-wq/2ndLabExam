import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Student fields are normalized from the user directory response in StudentsScreen.
export type Student = {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  course?: string | null;
};

export default function StudentCard({ student }: { student: Student }) {
  const router = useRouter();
  const initials = (student.name || 'Student')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const handleViewDetails = () => {
    if (student.id === undefined || student.id === null) {
      return;
    }

    router.push({
      pathname: '/student/[id]',
      params: { id: String(student.id) },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <View style={styles.details}>
          <Text style={styles.name}>{student.name || 'Name not available'}</Text>
          <Text style={styles.email} numberOfLines={1}>{student.email || 'Email not available'}</Text>
        </View>
      </View>
      {student.course ? (
        <View style={styles.tag}><Text style={styles.tagText}>{student.course}</Text></View>
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.idText}>STUDENT RECORD</Text>
        <Pressable accessibilityRole="button" style={styles.button} onPress={handleViewDetails}>
          <Text style={styles.buttonText}>View details</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 17, borderRadius: 18, backgroundColor: '#ffffff', marginBottom: 13, gap: 14, borderWidth: 1, borderColor: '#e8edf4', shadowColor: '#1c3554', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#e8f0ff', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#2d62ae', fontWeight: '800', fontSize: 16 },
  details: { flex: 1, gap: 4 },
  name: { color: '#17324d', fontSize: 16, fontWeight: '700' },
  email: { color: '#7b899d', fontSize: 12 },
  tag: { alignSelf: 'flex-start', backgroundColor: '#f1f5fb', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  tagText: { color: '#536b89', fontSize: 11, fontWeight: '700' },
  footer: { borderTopWidth: 1, borderTopColor: '#f0f3f7', paddingTop: 11, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idText: { color: '#9aa7b8', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  button: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingLeft: 10 },
  buttonText: { color: '#245bb2', fontSize: 13, fontWeight: '700' },
  arrow: { color: '#245bb2', fontSize: 20, lineHeight: 20 },
});
