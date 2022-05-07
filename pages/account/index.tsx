import { useState, useEffect } from "react";
import supabase from "../../lib/SupabaseClient";
import Auth from "../../components/Accounts/Auth";
import Account from "../../components/Accounts/Account";

export default function AccountPage() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <div>{!session ? <Auth /> : <Account />}</div>;
}
