import Auth from "../../components/Accounts/Auth";
import Account from "../../components/Accounts/Account";
import { useEffect, useState } from "react";
import supabase from "../../lib/SupabaseClient";

export default function AccountPage() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [])

  return <div>{!session ? <Auth /> : <Account />}</div>;
}
