import { Suspense } from "react";

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

// Instead of using this `let user: User | null;` variable in the module scope,
// suspend-react actually returns whatever value our promise resolves with. So,
// if we just pass in the `firebaseUser` to `resolve` and get rid of this `let user`,
// we can say: `const user = suspend(getInitialAuthState, ["initialAuthState"]);`
async function getInitialAuthState() {
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      resolve(firebaseUser);
      unsubscribe();
    });
  });
}

function Home() {
  // `suspend` works as follows: the first parameter is an async function that
  // returns a promise. So if we can pass in some async function to `suspend`,
  // then this library will take care of throwing the promise and triggering
  // suspense for us. We have already defined a promise before, so all we have to
  // do is return it. As a second parameter, we have an array of keys that is
  // used to keep track of these different promises in a global cache. For our
  // purposes, we can use the name "initialAuthState" as a key and that will be
  // enough to identify this promise for us.
  const user = suspend(getInitialAuthState, ["initialAuthState"]);

  // Notice that we managed to use Suspense and remove all the async code from
  // this component Home. We have hidden all all the third-party async code outside
  // of our component's rendering cycle up here in this `getInitialAuthState`
  // function. All we did was to wrap a Promise and resolve it inside of a callback.
  // Now, Home component is super slim and synchronous. When React hits the
  // `suspend` call above, since the getInitialAuthState is an appending state,
  // it is going to stop execution. React is gonna wait for that promise to
  // resolve and then try to render the component again. The second time it
  // renders, the `suspend` call is going to resolve synchronously with the value
  // of our user. React will be able to pass this line and render the code below.
  // Now we don't have a loading state in the component anymore and we are able
  // to handle it in our parent component, allowing us to have a suspense boundary
  // in our tree in case we have more components and want them to behave in a
  // specific manner.
  // Also notice that Firebase API doesn’t return a promise! So our async function
  // needs to return the Firebase call wrapped in a promise, but that one would
  // resolve immediately. To make it possible to resolve it immediately, we need
  // to make our Promise such that we can manually call resolve() within the
  //  Firebase callback.

  // The objective of this lesson is to understand the power of promises with
  // Suspense. Now, we can turn any async code or async work that needs to be
  // done into an async function that can then be used to suspend your react
  // component.

  // So far with our solution, you might have noticed that we lost something
  // from our original implementation with useEffect. If we change the state
  // of the user (for example, signout), our UI doesn't update. If we refresh,
  // we do see the correct UI. We are going to cover this issue in the next
  // commit.

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
