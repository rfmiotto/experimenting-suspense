import { useState } from "react";

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
// To fix this, we have to move the code inside a useEffect.

function TimestampComponent() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  setInterval(() => {
    console.log("setInterval is running even when showing is false");
    setTime(new Date().toLocaleTimeString());
  }, 1000);

  return <p>The time is: {time}</p>;
}

function ThirdApp() {
  const [showing, setShowing] = useState(true);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowing(!showing)}
        className="left-50 absolute top-10"
      >
        Toggle
      </button>
      {showing && <TimestampComponent />}
    </>
  );
}

export { ThirdApp };
