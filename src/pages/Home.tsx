import { Suspense } from "react";

import { ChipotleStats } from "../components/ChipotleStats";
import { TwitterStats } from "../components/TwitterStats";
import { YouTubeStats } from "../components/YoutubeStats";
import { InstagramStats } from "../components/InstagramStats";
import { Spinner } from "../components/Spinner";

function Loading() {
  return (
    <div className="flex items-center justify-center">
      <Spinner />
    </div>
  );
}

function Home() {
  return (
    <div className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Suspense fallback={<Spinner />}>
        <TwitterStats />
        <YouTubeStats />
        <ChipotleStats />
        <InstagramStats />
      </Suspense>
    </div>
  );
}

export { Home, Loading };
