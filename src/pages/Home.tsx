import { Suspense } from "react";
import { motion } from "framer-motion";

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
    <Suspense fallback={<Spinner />}>
      <motion.div
        variants={parent}
        initial="hidden"
        animate="show"
        className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <motion.div variants={stat}>
          <TwitterStats />
        </motion.div>

        <motion.div variants={stat}>
          <YouTubeStats />
        </motion.div>

        <motion.div variants={stat}>
          <ChipotleStats />
        </motion.div>

        <motion.div variants={stat}>
          <InstagramStats />
        </motion.div>
      </motion.div>
    </Suspense>
  );
}

export { Home, Loading };
