// Sign in API call for mock API
export async function signIn({ email, password }) {
  try {
    const response = await fetch('https://6850d0408612b47a2c079e71.mockapi.io/api/v1/users?email=' + encodeURIComponent(email));
    const users = await response.json();
    // Simulate password check (mock API does not store password)
    const user = users.find(u => u.email === email);
    if (user /* && user.password === password */) {
      return user;
    } else {
      throw new Error('Invalid email or password');
    }
  } catch (err) {
    throw err;
  }
}
