import { useState, useEffect } from 'react'
import supabase from '../../lib/SupabaseClient';
import Auth from '../../components/Accounts/Auth';
import Profile from '../../components/Accounts/Profile';

export default function Account() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
        <div>
            {!session ? <Auth /> : <Profile />}
        </div>
    )
}