// import { Suspense } from "react";

// import { Spinner } from "../components/Spinner";
import { Stat } from "../components/Stat";
import TwitterIcon from "../components/icons/TwitterIcon";
import YouTubeIcon from "../components/icons/YoutubeIcon";
import ChipotleIcon from "../components/icons/ChipotleIcon";
import InstagramIcon from "../components/icons/InstagramIcon";
import { Card } from "../components/Card";

function Home() {
  return (
    // <Suspense fallback={<Spinner />}>
    <div className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Card>
        <Stat Icon={TwitterIcon} label="Followers" endpoint="twitter" />
      </Card>

      <Card>
        <Stat Icon={YouTubeIcon} label="Subscribers" endpoint="youtube" />
      </Card>

      <Card>
        <Stat Icon={ChipotleIcon} label="Burritos" endpoint="chipotle" />
      </Card>

      <Card>
        <Stat Icon={InstagramIcon} label="Followers" endpoint="instagram" />
      </Card>
    </div>
    // </Suspense>
  );
}

export { Home };
