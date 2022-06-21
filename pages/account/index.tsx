import Auth from "../../components/Accounts/Auth";
import Account from "../../components/Accounts/Account";
import Head from "next/head";
import supabase from "../../lib/SupabaseClient";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/Auth";

export default function AccountPage() {
  const { session, user } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      await axios.post("/api/auth/cookie", {
        event: session?.user ? "SIGNED_IN" : "SIGNED_OUT",
        session: session,
      });
    });
  });

  return <div>
    <Head>
      <title>Profile</title>
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
    {!user ? <Auth /> : <Account />}
  </div>;
}
