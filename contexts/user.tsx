import { ApiError, Session, User } from "@supabase/supabase-js";
import axios from "axios";
import React, { SetStateAction, useContext } from "react";
import { useState, useEffect } from "react";
import supabase from "../lib/SupabaseClient";

interface IUserContext {
    user: User;
    session: Session;
    emailSignIn: any;
    oAuthSignIn: any;
    signOut: any;
}

const Context = React.createContext<IUserContext>(null);

const Provider = ({ children }) => {
    const [user, setUser] = useState(supabase.auth.user());
    const [session, setSession] = useState(supabase.auth.session());

    useEffect(() => {
        supabase.auth.onAuthStateChange(() => {
            setSession(supabase.auth.session());
        })
    }, []);

    useEffect(() => {
        const getUserProfile = async () => {
            const sessionUser = supabase.auth.user();

            if (sessionUser) {
                const {data: profile} = await supabase
                .from("users")
                .select("*")
                .eq("id", sessionUser.id)
                .single()

                setUser({
                    ...sessionUser,
                    ...profile
                });
            }
        };

        getUserProfile();

        supabase.auth.onAuthStateChange(() => {
            getUserProfile();
        })
    }, []);

    useEffect(() => {
        axios.post("/api/auth/cookie/set", {
            event: user ? "SIGNED_IN" : "SIGNED_OUT",
            session: supabase.auth.session(),
        });
    }, [user]);

    const emailSignIn = async (email: string, password: string) => {
        const { user, session, error } = await supabase.auth.signIn({
            email: email,
            password: password
        });
        if (error) return error;
        setUser(user);
        setSession(session);
    }

    const oAuthSignIn = async (refreshToken: string) => {
        const { user, session, error } = await supabase.auth.signIn({
            refreshToken: refreshToken,
        });
        if (error) return error;
        setUser(user);
        setSession(session);
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    }

    const exposed = {
        user,
        session,
        emailSignIn, 
        oAuthSignIn,
        signOut,
    };

    return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useUser = () => useContext(Context);

export default Provider;