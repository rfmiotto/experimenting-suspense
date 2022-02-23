// import { Suspense } from "react";
import { motion } from "framer-motion";

import TwitterIcon from "../components/icons/TwitterIcon";
import YouTubeIcon from "../components/icons/YoutubeIcon";
import ChipotleIcon from "../components/icons/ChipotleIcon";
import InstagramIcon from "../components/icons/InstagramIcon";
import { Card } from "../components/Card";
import { Stat } from "../components/Stat";
import { Spinner } from "../components/Spinner";

function Loading() {
  return (
    <Card>
      <Spinner />
    </Card>
  );
}

const parent = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const stat = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

function Home() {
  return (
    // <Suspense fallback={<Loading />}>
    <motion.div
      variants={parent}
      initial="hidden"
      animate="show"
      className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <motion.div variants={stat}>
        <Card>
          <Stat Icon={TwitterIcon} label="Followers" endpoint="twitter" />
        </Card>
      </motion.div>

      <motion.div variants={stat}>
        <Card>
          <Stat Icon={YouTubeIcon} label="Subscribers" endpoint="youtube" />
        </Card>
      </motion.div>

      <motion.div variants={stat}>
        <Card>
          <Stat Icon={ChipotleIcon} label="Burritos" endpoint="chipotle" />
        </Card>
      </motion.div>

      <motion.div variants={stat}>
        <Card>
          <Stat Icon={InstagramIcon} label="Followers" endpoint="instagram" />
        </Card>
      </motion.div>
    </motion.div>
    // </Suspense>
  );
}

export { Home, Loading };
