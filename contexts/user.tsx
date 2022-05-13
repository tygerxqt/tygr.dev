import { User } from "@supabase/supabase-js";
import axios from "axios";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import supabase from "../lib/SupabaseClient";

interface IUserContext {
    user: User;
}

const Context = React.createContext<Partial<IUserContext>>(null);

const Provider = ({ children }) => {
    const [user, setUser] = useState(supabase.auth.user());

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
            session: supabase.auth.session,
        });
    }, [user]);

    const signout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    }

    const exposed = {
        user,
    };

    return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useUser = () => useContext(Context);

export default Provider;