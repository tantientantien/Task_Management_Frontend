export interface User {
  id: string;
  email: string;
  avatar?: string;
  userName?: string;
}

export interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}