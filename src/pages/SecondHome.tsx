import { Suspense, useEffect, useState } from "react";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { suspend } from "suspend-react";

import { firebaseApp } from "../services/firebase";
import { Dashboard } from "../components/Dashboard";
import { SignIn } from "../components/SignIn";
import { Spinner } from "../components/Spinner";

const auth = getAuth(firebaseApp);

// In previous commits, we wrapped Firebase's `onAuthStateChanged` callback in
// a promise so that we could use it to suspend our application with `suspend`.
// But, by pulling the state out of the component into module scope and using
//  suspense to trigger the re-render, we lost the ability to update our app
// over time.

// The easiest way to solve this is to bring back the useEffect and useState
// in our component. In this commit, we implement this solution.

// This approach definitely solves our problem and we get a reactive app again.
// But, it was really interesting where we left off in the last commit, with
// all the observer code living in module scope. It is totally fine to leave the
// onAuthStateChanged in render, in an effect, but it just makes the code a
// little bit hard to follow. So ideally, we want to bring the code inside the
// useEffect out here in the module scope as well. How can we achieve this? We
// can't call `setCurrentUser` in module scope... This is where a state management
// library come in. We have Redux, Recoil, Zustand, Valtio, etc. These give us
// APIs to create and update state here at module scope, outside of render and
// then give us a bridge that we can use to read from that changing state from
// inside our components. Here, we are going to use Valtio because it is slim
// down and has a really nice API (see next commit).

async function getInitialAuthState() {
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      resolve(firebaseUser);
      unsubscribe();
    });
  });
}

function Home() {
  const initialCurrentUser = suspend(getInitialAuthState, ["initialAuthState"]);

  const [currentUser, setCurrentUser] = useState(initialCurrentUser);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
    });
  }, []);

  async function handleSignIn(): Promise<void> {
    await signInWithEmailAndPassword(auth, "test2@email.com", "123456");
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

        {currentUser ? <Dashboard user={currentUser} /> : <SignIn />}
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
