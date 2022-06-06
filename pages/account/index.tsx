import Auth from "../../components/Accounts/Auth";
import Account from "../../components/Accounts/Account";
import { useEffect, useState } from "react";
import supabase from "../../lib/SupabaseClient";
import Head from "next/head";

export default function AccountPage() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [])

  return <div>
    <Head>
      <title>Account</title>
      <meta name="title" content="Log in" />
      <meta
        name="description"
        content="Log in to your Pixel account to see this page."
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.tygr.dev/profile" />
      <meta property="og:title" content="tygerxqt" />
      <meta
        property="og:description"
        content="Log in to your Pixel account to see this page."
      />
      <meta property="og:image" content="https://images.ctfassets.net/547zkxycwgvr/4JPYvu5J5MXi5G4MpHF5qH/1f47ef5e0fee9dd8a23882cc716d1486/PixelSEO.png" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://tygr.dev/profile" />
      <meta property="twitter:title" content="tygerxqt" />
      <meta
        property="twitter:description"
        content="Log in to your Pixel account to see this page."
      />
      <meta
        property="twitter:image"
        content="https://images.ctfassets.net/547zkxycwgvr/4JPYvu5J5MXi5G4MpHF5qH/1f47ef5e0fee9dd8a23882cc716d1486/PixelSEO.png"
      />
    </Head>
    {!session ? <Auth /> : <Account />}
  </div>;
}
