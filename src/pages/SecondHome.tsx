import { Suspense } from "react";

import { User } from "firebase/auth";

import { Dashboard } from "../components/Dashboard";
import { SignIn } from "../components/SignIn";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";

// In this final version of the app, we have hidden all the complexity of authentication
// over the useAuth hook. This hook gives us a really nice point of abstraction.
// If we needed effects or react state, we could add it right before the line
// `return useSnapshot(state) as proxyType;`. This solution is very neat because
// we have `useSnapshot` pointing to the same global singleton state that lives
// in the module scope and we only have to set up the firebase observer one time.

function Home() {
  const { currentUser, status, handleSignIn, handleSignOut } = useAuth();
  console.log(status);

  return (
    <div className="flex flex-col">
      <div className="m-10 flex flex-col items-center rounded-xl bg-white p-4">
        <div className="mb-4 flex w-52 justify-between">
          <button
            type="button"
            onClick={handleSignIn}
            className="rounded-lg bg-slate-400 px-4 text-white"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg bg-slate-400 px-4 text-white"
          >
            Sign out
          </button>
        </div>

        {currentUser ? (
          <Dashboard user={currentUser as unknown as User} />
        ) : (
          <SignIn />
        )}
      </div>
    </div>
  );
}

function SecondApp() {
  return (
    <Suspense fallback={<Spinner />}>
      <Home />
    </Suspense>
  );
}

export { SecondApp };
