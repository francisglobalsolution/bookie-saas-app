import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../components/UserContext';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
  role?: string;
  isActive?: boolean;
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

async function signUp({ name, email, password }: SignUpParams): Promise<User> {
  try {
    const response = await fetch('https://6850d0408612b47a2c079e71.mockapi.io/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
        role: 'member',
        isActive: true,
      }),
    });
    const newUser = await response.json();
    console.log('✅ User created:', newUser);
    return newUser;
  } catch (err) {
    console.error('❌ Signup failed:', err);
    throw err;
  }
}

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const { setUser } = useUser();

  const handleSignUp = async () => {
    try {
      const newUser = await signUp({ name, email, password });
      if (newUser) {
        setUser(newUser);
        // Optionally navigate to another screen here
      }
    } catch {
      // Optionally show error to user
    }
  };

  return (
    <View style={[viewStyles.container, isMobile && viewStyles.containerMobile]}>
      {isMobile ? (
        <>
          <View style={viewStyles.mobileHeader}>
            <View style={viewStyles.logoCircleMobile}>
              <Text style={textStyles.logoIconMobile}>▲</Text>
            </View>
            <Text style={textStyles.logoTextMobile}>Bookie</Text>
          </View>
          <View style={viewStyles.formCardMobile}>
            <Text style={textStyles.titleMobile}>Get started free</Text>
            <Text style={textStyles.subtitleMobile}>Start your 30 day trial now</Text>
            <View style={viewStyles.inputGroup}>
              <Text style={textStyles.inputLabel}>Email Address</Text>
              <TextInput
                style={inputStyles.input}
                placeholder="youremail@email.com"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={viewStyles.inputGroup}>
              <Text style={textStyles.inputLabel}>Name</Text>
              <TextInput
                style={inputStyles.input}
                placeholder="Your Name"
                placeholderTextColor="#bbb"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            <View style={viewStyles.inputGroup}>
              <Text style={textStyles.inputLabel}>Password</Text>
              <View style={viewStyles.passwordRow}>
                <TextInput
                  style={inputStyles.input}
                  placeholder="***************"
                  placeholderTextColor="#bbb"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={viewStyles.eyeButton}>
                  <Text style={textStyles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={viewStyles.inputGroup}>
              <Text style={textStyles.inputLabel}>Confirm Password</Text>
              <View style={viewStyles.passwordRow}>
                <TextInput
                  style={inputStyles.input}
                  placeholder="***************"
                  placeholderTextColor="#bbb"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={viewStyles.eyeButton}>
                  <Text style={textStyles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={viewStyles.signUpButton} onPress={handleSignUp}>
              <Text style={textStyles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={viewStyles.orRow}>
              <View style={viewStyles.orLine} />
              <Text style={textStyles.orText}>Or sign up with</Text>
              <View style={viewStyles.orLine} />
            </View>
            <View style={viewStyles.socialRow}>
              <TouchableOpacity style={viewStyles.socialButton}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={inputStyles.socialIcon} />
                <Text style={textStyles.socialText}>Sign up with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[viewStyles.socialButton, viewStyles.facebookButton]}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }} style={inputStyles.socialIcon} />
              </TouchableOpacity>
            </View>
            <View style={viewStyles.signupRow}>
              <Text style={textStyles.signupText}>Already have an account?</Text>
              <TouchableOpacity style={viewStyles.signUpButton} onPress={() => router.push('/signin')}>
                <Text style={textStyles.signupButtonText}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={viewStyles.leftPanel}>
            <View style={viewStyles.logoRow}>
              <View style={viewStyles.logoCircle}>
                <Text style={textStyles.logoIcon}>▲</Text>
              </View>
              <Text style={textStyles.logoText}>Bookie</Text>
            </View>
            <Text style={textStyles.sloganSmall}>Bookie for all your Booking needs</Text>
            <Text style={textStyles.sloganLarge}>Transformative collaboration{"\n"}for larger team</Text>
            <View style={viewStyles.arrowCircle}>
              <Text style={textStyles.arrowIcon}>→</Text>
            </View>
          </View>
          <View style={viewStyles.rightPanel}>
            <Text style={textStyles.title}>Get started free</Text>
            <Text style={textStyles.subtitle}>Start your 30 day trial now</Text>
            <View style={viewStyles.inputGroup}>
              <Text style={textStyles.inputLabel}>Email Address</Text>
              <TextInput
                style={inputStyles.input}
                placeholder="youremail@email.com"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={viewStyles.inputGroup}>
              <Text style={textStyles.inputLabel}>Name</Text>
              <TextInput
                style={inputStyles.input}
                placeholder="Your Name"
                placeholderTextColor="#bbb"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            <View style={viewStyles.inputGroup}>
              <Text style={textStyles.inputLabel}>Password</Text>
              <View style={viewStyles.passwordRow}>
                <TextInput
                  style={inputStyles.input}
                  placeholder="***************"
                  placeholderTextColor="#bbb"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={viewStyles.eyeButton}>
                  <Text style={textStyles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={viewStyles.inputGroup}>
              <Text style={textStyles.inputLabel}>Confirm Password</Text>
              <View style={viewStyles.passwordRow}>
                <TextInput
                  style={inputStyles.input}
                  placeholder="***************"
                  placeholderTextColor="#bbb"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={viewStyles.eyeButton}>
                  <Text style={textStyles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={viewStyles.signUpButton} onPress={handleSignUp}>
              <Text style={textStyles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={viewStyles.orRow}>
              <View style={viewStyles.orLine} />
              <Text style={textStyles.orText}>Or sign up with</Text>
              <View style={viewStyles.orLine} />
            </View>
            <View style={viewStyles.socialRow}>
              <TouchableOpacity style={viewStyles.socialButton}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={inputStyles.socialIcon} />
                <Text style={textStyles.socialText}>Sign up with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[viewStyles.socialButton, viewStyles.facebookButton]}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }} style={inputStyles.socialIcon} />
              </TouchableOpacity>
            </View>
            <View style={viewStyles.signupRow}>
              <Text style={textStyles.signupText}>Already have an account?</Text>
              <TouchableOpacity style={viewStyles.signUpButton} onPress={() => router.push('/signin')}>
                <Text style={textStyles.signupButtonText}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const viewStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: '100vh',
    marginTop: 0,
    paddingTop: 0,
  },
  containerMobile: {
    flexDirection: 'column',
    backgroundColor: '#9466e6',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    height: '100%',
    padding: 0,
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
  leftPanel: {
    flex: 1,
    backgroundColor: '#9466e6',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 40,
    height: '100%',
    minHeight: 0,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  arrowCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    right: 40,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    maxWidth: 480,
    alignSelf: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 18,
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
  signUpButton: {
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
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
});

const textStyles = StyleSheet.create({
  logoIconMobile: {
    color: '#9466e6',
    fontWeight: 'bold',
    fontSize: 28,
  },
  logoTextMobile: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 4,
    marginBottom: 8,
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
  logoIcon: {
    fontSize: 24,
    color: '#9466e6',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  sloganSmall: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  sloganLarge: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  arrowIcon: {
    fontSize: 28,
    color: '#9466e6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  socialText: {
    color: '#444',
    fontSize: 14,
  },
  signupText: {
    color: '#888',
    fontSize: 14,
    marginRight: 8,
  },
  signupButtonText: {
    color: '#9466e6',
    fontWeight: 'bold',
    fontSize: 15,
  },
  eyeIcon: {
    fontSize: 18,
  },
});

const inputStyles = StyleSheet.create({
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
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
    resizeMode: 'contain',
  },
});
