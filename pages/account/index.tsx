import Auth from "../../components/Accounts/Auth";
import Account from "../../components/Accounts/Account";
import { useUser } from "../../contexts/user";

export default function AccountPage() {
  const { session } = useUser();

  return <div>{!session ? <Auth /> : <Account />}</div>;
}
