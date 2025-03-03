export interface Tokens {
    accessToken: string;
    refreshToken: string;
    token: string;
}
export interface AuthContextType {
    isAuthenticated: boolean;
    handleLogin: (user: string, password: string) => Promise<void>;
    logOut: () => void;
    token: string | null;
    error: string | null;
    isLoading: boolean;
    user: any;
}
