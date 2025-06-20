import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignInScreen from '../signin';
import { UserProvider } from '../../components/UserContext';
import { NavigationContainer } from '@react-navigation/native';

describe('SignInScreen', () => {
  it('renders email and password fields', () => {
    const { getByPlaceholderText } = render(
      <UserProvider>
        <NavigationContainer>
          <SignInScreen />
        </NavigationContainer>
      </UserProvider>
    );
    expect(getByPlaceholderText('youremail@email.com')).toBeTruthy();
    expect(getByPlaceholderText('***************')).toBeTruthy();
  });
});
