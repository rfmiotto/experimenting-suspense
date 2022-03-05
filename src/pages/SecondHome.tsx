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

// The first thing we are going to do in this refactor is to eliminate the duplicate
// of onAuthStateChanged. In order to do so, let's use a little trick to give us
// the ability to call resolve from the module scope. We start off by removing
// the content from inside initialCurrentUser and moving `resolve` to the global
// scope. Then we execute this function inside the `onAuthStateChanged` function.
// With that, we have only one observer for the lifetime of the application. We
// never unsubscribe. All we do is to resolve the promise the first time and
// updating the state value over time.

// valtio also makes it easy to do derived state. So, here we want to create a
// custom hook (useAuth) that will have a status, which is a derived property.
// Here, we are using a plain javascript getter for the status property, which
// is going to return some data base on the value of our state (currentUser) --
// that is why it is a derived state. So, we can look at `this.currentUser`, where
// `this` refers to the current value of the state, and if it is a Promise, we
// know that it is fetching the initialCurrentUser, and the status will be `unknown`.
// Otherwise, if `this.currentUser === null`, the status will be unauthenticated,
// otherwise, it will be authenticated. Try opening the browser devtools to see
// how the logs change when you sign in and out.
// As you can see, valtio gives you a lot of flexibility to create derived states
// that still updates. And still, we have a singleton module state that all
// components can reference to, so all components are referencing the same thing.
// Okay, in the next commit we will extract this logic into a useAuth hook.

let resolve: any;
const initialCurrentUser = new Promise<User | null>((r) => {
  resolve = r;
});

interface proxyType {
  currentUser: User | null | Promise<User | null>;
  status: "unknown" | "unauthenticated" | "authenticated";
}

const state = proxy<proxyType>({
  currentUser: initialCurrentUser,
  get status() {
    return this.currentUser instanceof Promise
      ? "unknown"
      : this.currentUser === null
      ? "unauthenticated"
      : "authenticated";
  },
});

onAuthStateChanged(auth, (firebaseUser) => {
  resolve();
  state.currentUser = firebaseUser;
});

function Home() {
  const { currentUser, status } = useSnapshot(state) as proxyType;
  console.log(status);

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
