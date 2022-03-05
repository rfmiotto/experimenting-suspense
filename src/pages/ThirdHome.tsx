import { useEffect, useState } from "react";

// In this example, we are going to look at a lower level API from React that
// will help us understand how to high level APIs actually work. Here, we have
// a simple app that shows the current time along with a toggle button that
// indicates if the timestamp should be displayed or not.
// In this original implementation, we have a little bug: there is a memory leak
// in our setInterval call. If you are familiar with React, you would expect a
// warning saying that you are "calling setState in an unmounted component".
// In React 18, though, this warning is not present anymore, but, if we add a
// console.log inside our setInterval, we will see that the interval is still
// going when showing is false. This problem occurs because it is a side effect.
// To fix this, we have to move the code inside a useEffect. With this, the
// setInterval is activated when the component mounts and deactivated when it
// unmounts.

// Okay, our clock seems to be working fine. But now, let's create another
// TimestampComponent. If we start toggling this on and off, we end up getting
// different versions of the time. There is a lot of flakiness coming from the
// fact that each component has it's own version of the time (i.e., its own
// useState). This is an example of data that is more global in nature. The
// current time, from the perspective of React app, should really resolve to the
// same thing, regardless of which component is referencing it. That is the
// motivating case for what is called "an external store". So, it would be nice
// if we could move the time data and the setInterval outside of React, in module
// scope.

function TimestampComponent() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const id = setInterval(() => {
      console.log("setInterval is running even when showing is false");
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <p>The time is: {time}</p>;
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
