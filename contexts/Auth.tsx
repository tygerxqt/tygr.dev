import React, { useEffect, useState, createContext, useContext } from 'react'
import { Session, User } from '@supabase/supabase-js'
import supabase from '../lib/SupabaseClient'
import axios from 'axios'
import UserData from '../types/Account/UserData'

export interface AuthSession {
    user: User | null
    session: Session | null,
    userData: UserData | null | undefined,
    update: () => void,
    signIn: (email: string, password: string) => void,
    signOut: () => void,
}

const AuthContext = createContext<AuthSession>({ user: null, session: null, userData: undefined, update: () => { }, signIn: () => { }, signOut: () => { } });
export const AuthProvider = ({ children }) => {
    const supabaseClient = supabase;
    const [session, setSession] = useState<Session | null>(
        supabaseClient.auth.session()
    )
    const [user, setUser] = useState<User | null>(session?.user ?? null)
    const [userData, setUserData] = useState<UserData | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
            }
        )

        async function fetchUserData() {
            const { data: userData, error } = await supabase.from("users").select("*").eq("id", user.id);
            if (error) throw new Error(`Failed to load user data. ${error}`);
            const { data: notifications, error: notificationError } = await supabase.from("notifications").select("*").eq("user", user.id);
            if (notificationError) throw new Error(`Failed to load user notifications. ${error}`);


            setUserData({
                ...userData[0],
                notifications,
            })
        }

        if (session) {
            fetchUserData();
        } else {
            setUserData(null);
        }

        setLoading(false);

        return () => {
            authListener?.unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value = {
        session,
        user,
        userData,
        update: async () => {
            const { data: userData, error } = await supabase.from("users").select("*").eq("id", user.id);
            if (error) throw new Error(`Failed to load user data. ${error}`);
            const { data: notifications, error: notificationError } = await supabase.from("notifications").select("*").eq("user", user.id);
            if (notificationError) throw new Error(`Failed to load user notifications. ${error}`);

            setUserData({
                ...userData[0],
                notifications,
            })
        },
        signIn: async (email: string, password: string) => {
            const { session } = await supabase.auth.signIn({ email: email, password: password });
            await axios.post("/api/auth/cookie", {
                event: "SIGNED_IN",
                session: session,
            });
        },
        signOut: async () => {
            await supabase.auth.signOut();
            await axios.post("/api/auth/cookie", {
                event: "SIGNED_OUT",
            });
            window.location.reload();
        }
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error(`useAuth must be used within a AuthContextProvider.`)
    }
    return context
}