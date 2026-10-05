import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// TODO EXAM: Match these fields to the provided API response.
export type Student = {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  course?: string | null;
};

export default function StudentCard({ student }: { student: Student }) {
  const router = useRouter();

  const handleViewDetails = () => {
    if (student.id === undefined || student.id === null) {
      return;
    }

    router.push({
      pathname: '/student/[id]',
      params: { id: String(student.id) },
    });
  };

  return React.createElement(
    View,
    { style: styles.card },
    React.createElement(Text, { style: styles.name }, student.name || 'Name not available'),
    React.createElement(Text, { style: styles.text }, student.email || 'Email not available'),
    student.course ? React.createElement(Text, { style: styles.text }, student.course) : null,
    React.createElement(
      Pressable,
      { accessibilityRole: 'button', style: styles.button, onPress: handleViewDetails },
      React.createElement(Text, { style: styles.buttonText }, 'View Details')
    )
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 12, backgroundColor: '#ffffff', marginBottom: 12, gap: 8 },
  name: { color: '#17324d', fontSize: 18, fontWeight: '600' },
  text: { color: '#536579' },
  button: { paddingVertical: 12, alignSelf: 'flex-start' },
  buttonText: { color: '#245bb2', fontWeight: '600' },
});
