import { User } from "firebase/auth";

type DashboardProps = {
  user: User;
};

function Dashboard({ user }: DashboardProps) {
  return <h1>{user.email}</h1>;
}

export { Dashboard };
