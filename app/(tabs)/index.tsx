import { Button } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SignInScreen from '../signin';
import { useUser } from '../../components/UserContext';

export default function HomeScreen() {
  const { user, setUser } = useUser();
  if (!user) {
    return <SignInScreen />;
  }
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">Welcome, {user.name || user.email}!</ThemedText>
      <ThemedText>Your email: {user.email}</ThemedText>
      <Button title="Sign Out" onPress={() => setUser(null)} />
    </ThemedView>
  );
}
