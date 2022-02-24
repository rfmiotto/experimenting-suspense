import { useState, useEffect, Suspense } from "react";

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

let user: User;
const promise = new Promise<void>((resolve) => {
  setTimeout(() => {
    user = { email: "test@email.com" } as User;
    resolve();
  }, 2000);
});

function Home() {
  // const [user, setUser] = useState<User | null>(null);

  // This useEffect causes some weird behavior. When we refresh the page, we need
  // to load the data from Firebase, but this `onAuthStateChanged` is running
  // inside of a useEffect after the mount.
  // How can we fix this? We could add some new states to handle this behavior,
  // but ideally, we would be able to use Suspense. This is a perfect candidate
  // for it: the Home component is not ready to render while Firebase is fetching
  // and we would be able to tell its parent to suspend the application.
  // But, there is no clear way to do this. All we have is this `onAuthStateChanged`
  // observer that fires a callback. So, we need some sort of bridge in order to
  // use Suspense.

  // useEffect(() => {
  //   onAuthStateChanged(auth, (firebaseUser) => {
  //     setUser(firebaseUser);
  //   });
  // }, []);

  // The way Suspense works, we need to throw a promise to render its fallback
  // component, which in our case is a Spinner. In order to stop the spinner, we
  // need to resolve the promise. To mimic that effect, I'm going to use a setTimeout.
  // But this creates an interesting behavior: since our user still does not
  // exist, React keeps throwing this promise trying to render this.
  // Notice that the console log will start print "rendering" like crazy after
  // the initial timeout. So we need a way to update user. But, we can't update
  // the user value within our promise using setUser because we don't have access
  // to this. For now, let's create a user in the module scope and then update
  // its value when we resolve the promise. But, we don't want to use this dummy
  //  timeout function. We wanna actually use our onAuthStateChanged code. So
  // let's do this...
  console.log("rendering");

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
      <p className="mb-10 max-w-lg">
        In this example, after signing in, you will observe a weird behavior
        when refreshing the page
      </p>
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
