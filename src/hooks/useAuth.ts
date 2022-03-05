import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { proxy, useSnapshot } from "valtio";

import { firebaseApp } from "../services/firebase";

const auth = getAuth(firebaseApp);

let resolve: any;
const initialCurrentUser = new Promise<User | null>((r) => {
  resolve = r;
});

// ideally, we would have the email and password as function arguments...
async function handleSignIn(): Promise<void> {
  await signInWithEmailAndPassword(auth, "test2@email.com", "123456");
}

async function handleSignOut(): Promise<void> {
  await auth.signOut();
}

interface proxyType {
  currentUser: User | null | Promise<User | null>;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  status: "unknown" | "unauthenticated" | "authenticated";
}

const state = proxy<proxyType>({
  currentUser: initialCurrentUser,
  handleSignIn,
  handleSignOut,
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

export function useAuth() {
  return useSnapshot(state) as proxyType;
}
