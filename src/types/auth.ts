export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  plan: 'free' | 'pro';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => void;
  error: string | null;
}
