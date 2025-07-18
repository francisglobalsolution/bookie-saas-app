export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
  role?: string;
  isActive?: boolean;
}

// Sign in API call for mock API
export async function signIn({ email, password }: { email: string; password?: string }): Promise<User> {
  const response = await fetch(
    "https://6850d0408612b47a2c079e71.mockapi.io/api/v1/users?email=" +
      encodeURIComponent(email),
  );
  const users: User[] = await response.json();
  // Simulate password check (mock API does not store password)
  const user = users.find((u: User) => u.email === email);
  if (user /* && user.password === password */) {
    return user;
  } else {
    throw new Error("Invalid email or password");
  }
}
