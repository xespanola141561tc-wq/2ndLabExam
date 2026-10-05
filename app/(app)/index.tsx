import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardScreen() {
  const { user } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'there';
  const initials = (user?.name || 'S')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.eyebrow}>STUDENT SERVICE PORTAL</Text>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        </View>
        <Text style={styles.title}>Welcome back,</Text>
        <Text style={styles.name}>{firstName}</Text>
        <Text style={styles.subtitle}>Your campus services, all in one place.</Text>
        <View style={styles.heroFooter}>
          <View style={styles.onlineDot} />
          <Text style={styles.heroFooterText}>Your account is ready</Text>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Quick access</Text>
          <Text style={styles.sectionSubtitle}>Where would you like to go?</Text>
        </View>
        <Text style={styles.sectionMark}>02</Text>
      </View>
      <Link href="/(app)/students" asChild>
        <Pressable accessibilityRole="button" style={styles.card}>
          <View style={[styles.cardIcon, styles.studentsIcon]}><Text style={styles.cardIconText}>ST</Text></View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Student directory</Text>
            <Text style={styles.cardDescription}>Search students and view their profiles.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </Link>
      <Link href="/(app)/profile" asChild>
        <Pressable accessibilityRole="button" style={styles.card}>
          <View style={[styles.cardIcon, styles.profileIcon]}><Text style={styles.cardIconText}>ME</Text></View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>My profile</Text>
            <Text style={styles.cardDescription}>Review your details and account session.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </Link>
      <Text style={styles.footerNote}>STUDENT SERVICE PORTAL  ·  CCE106</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, width: '100%', maxWidth: 640, alignSelf: 'center', padding: 20, paddingTop: 22, gap: 14, backgroundColor: '#f3f6fb' },
  hero: { overflow: 'hidden', backgroundColor: '#173653', borderRadius: 23, padding: 22, gap: 4, marginBottom: 8, shadowColor: '#15314f', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  eyebrow: { color: '#aec8e6', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#ffffff24', borderWidth: 1, borderColor: '#ffffff3a', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },
  title: { color: '#d8e7f7', fontSize: 17, fontWeight: '600' },
  name: { color: '#ffffff', fontSize: 34, lineHeight: 39, fontWeight: '800', letterSpacing: -0.7, marginBottom: 4 },
  subtitle: { color: '#c0d1e4', fontSize: 14, lineHeight: 20 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 17, paddingTop: 13, borderTopWidth: 1, borderTopColor: '#ffffff20' },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#6fdb9c' },
  heroFooterText: { color: '#d6e5f5', fontSize: 11, fontWeight: '600' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 1, marginBottom: 2 },
  sectionTitle: { color: '#17324d', fontSize: 21, fontWeight: '800', letterSpacing: -0.3 },
  sectionSubtitle: { color: '#8290a4', fontSize: 12, marginTop: 3 },
  sectionMark: { color: '#91a1b6', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  card: { minHeight: 100, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 18, borderWidth: 1, borderColor: '#e8edf4', padding: 16, gap: 14, shadowColor: '#1c3554', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  cardIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  studentsIcon: { backgroundColor: '#e8f0ff' },
  profileIcon: { backgroundColor: '#eaf7f2' },
  cardIconText: { color: '#2d62ae', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  cardBody: { flex: 1, gap: 5 },
  cardTitle: { color: '#17324d', fontSize: 16, fontWeight: '700' },
  cardDescription: { color: '#7b899d', fontSize: 12, lineHeight: 17 },
  arrow: { color: '#7b91ae', fontSize: 24, lineHeight: 26, paddingLeft: 4 },
  footerNote: { color: '#a0aabc', fontSize: 9, fontWeight: '700', letterSpacing: 1.1, textAlign: 'center', marginTop: 8 },
});
