import { Suspense } from "react";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

import TwitterIcon from "../components/icons/TwitterIcon";
import YouTubeIcon from "../components/icons/YoutubeIcon";
import ChipotleIcon from "../components/icons/ChipotleIcon";
import InstagramIcon from "../components/icons/InstagramIcon";
import { Card } from "../components/Card";
import { Stat } from "../components/Stat";
import { Spinner } from "../components/Spinner";
import { Error } from "../components/Error";

function Loading() {
  return (
    <Card>
      <Spinner />
    </Card>
  );
}

function ErrorCard() {
  return (
    <Card>
      <Error>Could not fetch data</Error>
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
    <motion.div
      variants={parent}
      initial="hidden"
      animate="show"
      className="my-10 grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <ErrorBoundary fallback={<ErrorCard />}>
        <Suspense fallback={<Loading />}>
          <motion.div variants={stat}>
            <Card>
              <Stat Icon={TwitterIcon} label="Followers" endpoint="twitter" />
            </Card>
          </motion.div>
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ErrorCard />}>
        <Suspense fallback={<Loading />}>
          <motion.div variants={stat}>
            <Card>
              <Stat Icon={YouTubeIcon} label="Subscribers" endpoint="youtube" />
            </Card>
          </motion.div>
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ErrorCard />}>
        <Suspense fallback={<Loading />}>
          <motion.div variants={stat}>
            <Card>
              <Stat Icon={ChipotleIcon} label="Burritos" endpoint="chipotle" />
            </Card>
          </motion.div>
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ErrorCard />}>
        <Suspense fallback={<Loading />}>
          <motion.div variants={stat}>
            <Card>
              <Stat
                Icon={InstagramIcon}
                label="Followers"
                endpoint="instagram"
              />
            </Card>
          </motion.div>
        </Suspense>
      </ErrorBoundary>
    </motion.div>
  );
}

export { Home, Loading };
