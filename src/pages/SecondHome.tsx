import { Suspense } from "react";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

import { firebaseApp } from "../services/firebase";
import { Dashboard } from "../components/Dashboard";
import { SignIn } from "../components/SignIn";
import { Spinner } from "../components/Spinner";

const auth = getAuth(firebaseApp);

// So here is our solution: we now have our onAuthStateChanged code inside the
// promise and we resolve it in the onAuthStateChanged callback function.
// In order to be good citizens, let's get the unsubscribe function that the
// onAuthStateChanged function returns (you can name the variable as you want)
// and execute it after resolving the promise. We do this so the onAuthStateChanged
// code does not keep running over and over again (since it is an event listener).
// Despite this solution works, it is not a very scalable or composable architecture.
// Fortunately, there is a library called "suspend-react" that helps us to write
// a better code.
// OBS: if you are trying to run this code, it may not work as expected because,
// as we will see later on, we lost the ability to have our app update over time
// with this approach.
let user: User | null;
const promise = new Promise<void>((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    user = firebaseUser ?? ({ email: "Need to login" } as User);
    unsubscribe();
    resolve();
  });
});

function Home() {
  if (!user) {
    throw promise;
  }

  async function handleSignIn(): Promise<void> {
    await signInWithEmailAndPassword(auth, "test@email.com", "123456");
  }

  async function handleSignOut(): Promise<void> {
    await auth.signOut();
  }

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

        {user ? <Dashboard user={user} /> : <SignIn />}
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
