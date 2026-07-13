import type { AuthContextValue } from "@/types/auth.types";
import { createContext, useContext } from "react";



export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return ctx;
}