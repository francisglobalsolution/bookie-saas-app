import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../components/UserContext';
import { signIn } from '../components/auth';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const { setUser } = useUser();

  const handleSignIn = async () => {
    setError('');
    try {
      const user = await signIn({ email, password });
      setUser(user);
      router.push('/'); // Navigate to home after sign in
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {isMobile ? (
        <>
          <View style={styles.mobileHeader}>
            <View style={styles.logoCircleMobile}>
              <Text style={styles.logoIconMobile}>▲</Text>
            </View>
            <Text style={styles.logoTextMobile}>Bookie</Text>
          </View>
          <View style={styles.formCardMobile}>
            <Text style={styles.titleMobile}>Sign in to Bookie</Text>
            <Text style={styles.subtitleMobile}>Enter your account details below</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="youremail@email.com"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.input}
                  placeholder="***************"
                  placeholderTextColor="#bbb"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign in</Text>
            </TouchableOpacity>
            {error ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</Text> : null}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Or sign in with</Text>
              <View style={styles.orLine} />
            </View>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={styles.socialIcon} />
                <Text style={styles.socialText}>Sign in with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }} style={styles.socialIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Do not have an account?</Text>
              <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/signup')}>
                <Text style={styles.signupButtonText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Left Side */}
          <View style={styles.leftPanel}>
            <View style={styles.logoRow}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>▲</Text>
              </View>
              <Text style={styles.logoText}>Bookie</Text>
            </View>
            <Text style={styles.sloganSmall}>Bookie for all your Booking needs</Text>
            <Text style={styles.sloganLarge}>Transformative collaboration{"\n"}for larger team</Text>
            <View style={styles.arrowCircle}>
              <Text style={styles.arrowIcon}>→</Text>
            </View>
          </View>
          {/* Right Side */}
          <View style={styles.rightPanel}>
            <Text style={styles.title}>Sign in to Bookie</Text>
            <Text style={styles.subtitle}>Enter your account details below</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="youremail@email.com"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.input}
                  placeholder="***************"
                  placeholderTextColor="#bbb"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign in</Text>
            </TouchableOpacity>
            {error ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</Text> : null}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Or sign in with</Text>
              <View style={styles.orLine} />
            </View>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={styles.socialIcon} />
                <Text style={styles.socialText}>Sign in with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }} style={styles.socialIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Do not have an account?</Text>
              <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/signup')}>
                <Text style={styles.signupButtonText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 0,
    paddingTop: 0,
  },
  containerMobile: {
    flexDirection: 'column',
    backgroundColor: '#9466e6',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 600, // Use a number or '100%' for RN, not '100vh'
    height: '100%',
    padding: 0,
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#9466e6',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 40,
    height: '100%',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoIcon: {
    color: '#9466e6',
    fontWeight: 'bold',
    fontSize: 22,
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  sloganSmall: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 10,
  },
  sloganLarge: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 40,
  },
  arrowCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  arrowIcon: {
    color: '#9466e6',
    fontSize: 28,
    fontWeight: 'bold',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    maxWidth: 480,
    alignSelf: 'center',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  rightPanelMobile: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 24,
    maxWidth: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  logoRowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoTextMobile: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 30,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: '#9466e6',
    fontSize: 14,
  },
  signInButton: {
    width: '100%',
    height: 44,
    backgroundColor: '#9466e6',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#9466e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    width: '100%',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  socialRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    flex: 1,
  },
  facebookButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginRight: 0,
    marginLeft: 10,
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
    resizeMode: 'contain',
  },
  socialText: {
    color: '#444',
    fontSize: 14,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#888',
    fontSize: 14,
    marginRight: 8,
  },
  signupButton: {
    borderWidth: 1,
    borderColor: '#9466e6',
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 22,
  },
  signupButtonText: {
    color: '#9466e6',
    fontWeight: 'bold',
    fontSize: 15,
  },
  mobileHeader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  logoCircleMobile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoIconMobile: {
    color: '#9466e6',
    fontWeight: 'bold',
    fontSize: 28,
  },
  formCardMobile: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 24,
    width: '95%',
    maxWidth: 480,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  titleMobile: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
    textAlign: 'center',
  },
  subtitleMobile: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
    textAlign: 'center',
  },
});
