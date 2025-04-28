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
}

export interface IUser {
    first_name: string;
    role: string | null;
}

export interface IRole{
    userRole: string;
}


