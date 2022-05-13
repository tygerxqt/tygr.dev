import Auth from "../../components/Accounts/Auth";
import Profile from "../../components/Accounts/Profile";
import { useUser } from "../../contexts/user";

export default function Account() {
  const { session } = useUser();

  return <div>{!session ? <Auth /> : <Profile />}</div>;
}
