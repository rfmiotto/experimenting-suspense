import { Suspense, useEffect, useState } from "react";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { suspend } from "suspend-react";
import { proxy, useSnapshot } from "valtio";

import { firebaseApp } from "../services/firebase";
import { Dashboard } from "../components/Dashboard";
import { SignIn } from "../components/SignIn";
import { Spinner } from "../components/Spinner";

const auth = getAuth(firebaseApp);

// async function getInitialAuthState() {
//   return new Promise<User | null>((resolve) => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       resolve(firebaseUser);
//       unsubscribe();
//     });
//   });
// }

// In order to create and update state in our module scope, we are going to use
// valtio. We start by just creating a new state using proxy method, that takes
// an initial object as input. We will have one property called `currentUser`
// that will be initialized as `null`. We also bring back our observer `onAuthStateChanged`
// right below our state, and instead of calling `setCurrentUser`, we will just
// say that `state.currentUser = firebaseUser`. Now, in our Home component, we
// use `useSnapshot` from valtio to catch changes in our state. From that state,
// we will grab the currentUser property from.
// For now, let's comment out the `suspend` call. Notice that after these changes
// we are back to the original scenario in which our component is reactive but
// it still have that undesired behavior when we refresh the page, where we get
// a flash of content when `currentUser` is null. Basically, all we did was to
//  move the logic from the component (via useState and useEffect) into module
// scope (via valtio). The useSnapshot hook makes our component reactive again
// even if the state lives outside of the component.
// Now, to solve our "flash problem" we need to get suspense back in the component.
// Let's see how to do that in the next commit...

interface proxyType {
  currentUser: User | null;
}

const state = proxy<proxyType>({
  currentUser: null,
});

onAuthStateChanged(auth, (firebaseUser) => {
  state.currentUser = firebaseUser;
});

function Home() {
  // const initialCurrentUser = suspend(getInitialAuthState, ["initialAuthState"]);

  const { currentUser } = useSnapshot(state) as proxyType;

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
