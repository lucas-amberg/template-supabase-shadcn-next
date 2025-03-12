"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase, signIn, signUp, signOut } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error: any }>;
    register: (
        email: string,
        password: string,
        username: string,
    ) => Promise<{ error: any }>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };

        getUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            },
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await signIn(email, password);
        if (!error) {
            router.push("/dashboard");
        }
        return { error };
    };

    const register = async (
        email: string,
        password: string,
        username: string,
    ) => {
        const { error } = await signUp(email, password, username);
        return { error };
    };

    const logout = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
