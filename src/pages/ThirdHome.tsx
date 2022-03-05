import { useState, useSyncExternalStore } from "react";

// In the code below, we moved the time data and the setInterval function to
// module scope. Now, both TimestampComponent reference to the same time, but
// they don't update anymore. They only update when a re-render happens, like
// when one clicks the toggle button for example. And that is the problem with
// external stores: how do they communicate to React to trigger re-render?
// Up til now, there has been no real way to do that, but now we have an API that
// let us do that. Let's see how it works...

// To fix this problem, we will use the `useSyncExternalStore` that comes directly
// from React. This function takes 2 functions as arguments: the first one gives
// us a way to notify React that some external store has changed. In this first
// function, we want to actually grab hold of this notify callback so we can call
// ourselves. So we will create a `notifiers` variable which will be a new `Set`
// which is kind of like an array but it has some more features around object
// identity and some convenience methods for us. Then, we will save the notify
// into this set. We also need to return a cleanup function from this which we
// will just use to call `notifiers.delete` to remove the notify function from
// our set. Now, the second function argument of useSyncExternalStore needs to
// return a snapshot of our store. In our case, the store is just the time property.
// The useSyncExternalStore function is going to give us a store in our component,
// bridging the gap from outside React in inside React.
// Now, instead of rendering the `time` directly, we will render the `store`
// returned by useSyncExternalStore. However, we still need to notify React of our
// updates, otherwise, we will get the exact same behavior as before: where we
// the time is rendered but it does not update. To notify React of the changes,
// we do that inside setInterval, where our `time` variable changes.
// And that solves our problem: now we got our time updating in both components
// and you will never see an inconsistent state displaying different values
// after you toggle the components on and off. That is because now the time value
// from each component always points back to a single global variable.

const notifiers = new Set<() => void>();

let time = new Date().toLocaleTimeString();

setInterval(() => {
  console.log("setInterval is running even when showing is false");
  time = new Date().toLocaleTimeString();

  notifiers.forEach((notify) => notify()); // notify React that an external store has changed
}, 1000);

function TimestampComponent() {
  const store = useSyncExternalStore(
    (notify) => {
      notifiers.add(notify);

      return () => notifiers.delete(notify);
    },
    () => time
  );

  return <p>The time is: {store}</p>;
}

function ThirdApp() {
  const [showing, setShowing] = useState(true);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setShowing(!showing)}
        className="left-50 absolute top-10"
      >
        Toggle
      </button>
      {showing && <TimestampComponent />}
      <TimestampComponent />
    </div>
  );
}

export { ThirdApp };
