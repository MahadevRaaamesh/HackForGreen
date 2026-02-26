import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import type { ReactNode } from 'react';

// Define the AuthData type
export type AuthData = {
    token: string | null | undefined;
    user: User | null | undefined;
    role: string | null | undefined;
    name: string | null | undefined;
};

// Define the shape of the context value
interface AuthContextType {
    value: AuthData | null;
    set: (data: AuthData) => void;
    remove: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authData, setAuthData] = useState<AuthData | null>(() => {
        // Initialize state from localStorage on first render
        try {
            const storedAuth = localStorage.getItem('authData');
            return storedAuth ? JSON.parse(storedAuth) : null;
        } catch (error) {
            console.error("Failed to parse authData from localStorage", error);
            return null;
        }
    });

    // Effect to update localStorage whenever authData changes
    useEffect(() => {
        if (authData) {
            localStorage.setItem('authData', JSON.stringify(authData));
        } else {
            localStorage.removeItem('authData');
        }
    }, [authData]);

    const setAuth = (data: AuthData) => {
        setAuthData(data);
    };

    const removeAuth = () => {
        setAuthData(null);
    };

    const value = {
        value: authData,
        set: setAuth,
        remove: removeAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};