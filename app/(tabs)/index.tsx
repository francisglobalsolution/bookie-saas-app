import { Image } from 'expo-image';
import { Button, Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
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

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
