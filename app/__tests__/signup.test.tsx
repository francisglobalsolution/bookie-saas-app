import React from 'react';
import { render } from '@testing-library/react-native';
import SignUpScreen from '../signup';
import { UserProvider } from '../../components/UserContext';
import { NavigationContainer } from '@react-navigation/native';

describe('SignUpScreen', () => {
  it('renders email, name, and password fields', () => {
    const { getByPlaceholderText, getAllByPlaceholderText } = render(
      <UserProvider>
        <NavigationContainer>
          <SignUpScreen />
        </NavigationContainer>
      </UserProvider>
    );
    expect(getByPlaceholderText('youremail@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Your Name')).toBeTruthy();
    // There are two password fields (password and confirm password)
    expect(getAllByPlaceholderText('***************').length).toBe(2);
  });
});
