import type { AuthContextValue } from "@/types/auth.types";
import { createContext, useContext } from "react";
import type { DirectoryContextValue } from "./DirectoryContext";



export const AuthContext = createContext<AuthContextValue | null>(null);
export const DirectoryContext = createContext<DirectoryContextValue | null>(null);


export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return ctx;
}

export function useDirectory(): DirectoryContextValue {
    const context = useContext(DirectoryContext);
    if (!context) {
        throw new Error('useDirectory must be used inside <DirectoryProvider>');
    }
    return context;
};
