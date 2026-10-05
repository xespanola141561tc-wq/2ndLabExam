import { Tabs } from 'expo-router';

export default function AppLayout() {
  // TODO EXAM: Check authentication and session restoration before showing the tabs.
  // TODO EXAM: Redirect unauthenticated users to /sign-in.
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#245bb2', headerTintColor: '#17324d', tabBarIconStyle: { display: 'none' } }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="students" options={{ title: 'Students' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}