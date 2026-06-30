export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
export interface AuthContextType {
    isAuthenticated: boolean;
    handleLogin: (user: string, password: string) => Promise<void>;
    logOut: () => void;
    error: string | null;
    isLoading: boolean;
    user: IUser | null;
    count: number;
    setCount: React.Dispatch<React.SetStateAction<number>>;
}

export interface IUser {
    first_name: string;
    role: string | null;
}

export interface IRole{
    userRole: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
  user: IUser | null;
  isLoading: boolean;
}