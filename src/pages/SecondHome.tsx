import { Suspense } from "react";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { proxy, useSnapshot } from "valtio";

import { firebaseApp } from "../services/firebase";
import { Dashboard } from "../components/Dashboard";
import { SignIn } from "../components/SignIn";
import { Spinner } from "../components/Spinner";

const auth = getAuth(firebaseApp);

// Although we are not using the function `getInitialAuthState` anymore, we have
// declared a Promise in there that resolves once the callback runs for the first
// time. So let's use this Promise and name it `initialCurrentUser`.

const initialCurrentUser = new Promise<User | null>((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    resolve(firebaseUser);
    unsubscribe();
  });
});

// Now, instead of using `null` as an initial state for our `currentUser`, let's
// use the `initialCurrentUser` defined above, which is a promise. Just by doing
// so, our app is suspending again. That is a really cool feature from valtio:
// if you try to access a property of your state that happens to be a promise,
// valtio is gonna go ahead and throw it. It can do that because of this "proxy"
// setup, which is going to suspend our application. And now, our application is
// working as expected again, but without using useEffect or useState and keeping
// the state globally, in module scope.
// But, as you can see, this file contains a lot of responsibilities. We have 2
// observers that are interacting with library code (onAuthStateChanged) and this
// part is making our code a little bit confusing and hard to follow. In the
// next commit, we are going to refactor this code...

interface proxyType {
  currentUser: User | null | Promise<User | null>;
}

const state = proxy<proxyType>({
  currentUser: initialCurrentUser,
});

onAuthStateChanged(auth, (firebaseUser) => {
  state.currentUser = firebaseUser;
});

function Home() {
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
