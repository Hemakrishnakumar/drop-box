import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { authService } from '@/services';
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types';
import { AuthContext } from './index';



export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const refetchUser = useCallback(async () => {
        setLoading(true);
        try {
            setUser(await authService.getProfile());
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refetchUser();
    }, [refetchUser]);

    const login = useCallback(async (payload: LoginPayload) => {
        setLoading(true);
        setError(null);

        try {
            const { user: authenticatedUser } = await authService.login(payload);
            setUser(authenticatedUser);
        } catch (err: unknown) {
            const message = (err as { message?: string }).message ?? 'Login failed. Please try again.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        setLoading(true);
        setError(null);

        try {
            await authService.register(payload);
        } catch (err: unknown) {
            const message =
                (err as { message?: string }).message ?? 'Registration failed. Please try again.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: Boolean(user),
                error,
                clearError,
                login,
                register,
                refetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
