import { useEffect, useState } from "react";
import Auth from "../../components/Accounts/Auth";
import Profile from "../../components/Accounts/Profile";
import supabase from "../../lib/SupabaseClient";

export default function ProfilePage() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
  }, []);

  return <div>{!session ? <Auth /> : <Profile />}</div>;
}
