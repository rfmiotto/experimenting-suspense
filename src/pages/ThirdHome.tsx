import { useState } from "react";

// In the code below, we moved the time data and the setInterval function to
// module scope. Now, both TimestampComponent reference to the same time, but
// they don't update anymore. They only update when a re-render happens, like
// when one clicks the toggle button for example. And that is the problem with
// external stores: how do they communicate to React to trigger re-render?
// Up til now, there has been no real way to do that, but now we have an API that
// let us do that. Let's see how it works...

let time = new Date().toLocaleTimeString();

setInterval(() => {
  console.log("setInterval is running even when showing is false");
  time = new Date().toLocaleTimeString();
}, 1000);

function TimestampComponent() {
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
