import { useState, useSyncExternalStore } from "react";

// If we start looking at some of the code from the previous commit, you will see
// within some of the React discussions that the first function argument from
// useSyncExternalStore is usually called "subscribe". So let's refactor this code
// to make it consistent to the React standards and nomenclature. And this naming
// totally makes sense because it is how React is subscribing to changes to our
// external store.
// Notice though that this useSyncExternalStore is not really intended for app
// developers in your day-to-day react app development, but as you can see, by
// giving us this point of abstraction where React can subscribe to an external
// store and then fetch the current value, we were able to use normal state that
// lives in module scope that can update and triggers re-render over time without
// having to do anything funky like getting hold of a setState or anything like
// that. And in fact, state management libraries like Redux, Zustand, Valtio, Jotai,
// Recoil have you set a store up outside of your React component and if you
// need some way to tell React to re-render, this is kind of the new and robust
// way to do it.
// In our case, the store is just the `let time = new Date().toLocaleTimeString();`
// but normally, you would see something like:
//
// let store = {
//   users: [],
// };
//
// The take away of the first function argument is that it is a way to notify
// React when there is a change in the store. But what about the second function
// argument? React basically uses it to query your store. But why not to just
// notify React by passing the new version of our store whenever we're calling
// `notify()`? Wouldn't it be enough for React to get the new version of our state?
// Why does this second function argument of useSyncExternalStore exist?
// By the way, this second argument is usually referred to as `getSnapshot`. In
// short, this has to do with the concurrent mode features like transitions and
// suspense that are coming in React 18. In earlier versions of React that use all
// sync rendering, you could have multiple components that reference some variable
// that is external to React and they would never disagree with each other, you
// would never get an inconsistent rendering of your app. That is because when
// React starts to render your application for a given state from the root all
// the way down, it does that synchronously. Javascript is single threaded, so,
// once React starts doing that work and no matter how long it takes to render
// all those components, it's gonna finish in one shot. So, as React is rendering
// those components, they are all referencing some external state, but that state
// is going to be the same value for that entire one-shot render. The interesting
// thing about concurrent mode is that it is adding these features that allow
// React to actually pause rendering while a given tree is being rendered to the
// screen. React can start rendering some of the components in your tree, it can
// hit a transition or a component that suspends, and it can choose to yield the
// thread of Javascript back to the browser while that work is being done in
// background, and the browser can respond to keyboard inputs or other user
// events while that new tree is being prepared. And because now rendering takes
// time and we have this interval of time where we yield control back to the
// browser, this external state could have changed and React wouldn't know about
// it because we are not using setState here or anything like that. So, because the
// state of our external store could change while react is pausing to allow these
// other things to happen, React doesn't want to render half of our components
// using the old version of our store and then the other half with the new version
// of the store. That is what this second function argument is about. It needs
// to return a cached version of our store that is exactly the same even in the
// case where a concurrent feature is being used and the rendering of our tree is
// paused.
// As mentioned previously, this is a very low level API of React, but it gives
// us a lot of the ideas behind the new popular libraries like Zustand, Jotai,
// the new Redux, among others. With that we are able to write code in our
//  components that looks and acts basically synchronous even though React
// is going to get a lot smarter about rendering our app in different chunks at
// different times with different priorities.

const notifiers = new Set<() => void>();

let time = new Date().toLocaleTimeString(); // our store

setInterval(() => {
  console.log("setInterval is running even when showing is false");
  time = new Date().toLocaleTimeString();

  notifiers.forEach((notify) => notify()); // notify React that an external store has changed
}, 1000);

function subscribe(notify: () => void) {
  notifiers.add(notify);

  return () => notifiers.delete(notify);
}

function getSnapshot() {
  return time;
}

function TimestampComponent() {
  const store = useSyncExternalStore(subscribe, getSnapshot);

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
