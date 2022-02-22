import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/solid";
import { useQuery } from "react-query";
import api from "../services/api";

import YouTubeIcon from "./icons/YoutubeIcon";
import { Spinner } from "./Spinner";

function YouTubeStats() {
  const { isLoading, isError, data, error } = useQuery<any, Error>(
    "youtube",
    async () => {
      const response = await api.get("youtube");
      return response.data;
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center overflow-hidden rounded-lg bg-white px-10 py-6 shadow">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h2>An error has occurred: ${error!.message}</h2>
      </div>
    );
  }

  return (
    <div className="flex items-center overflow-hidden rounded-lg bg-white px-10 py-6 shadow">
      <YouTubeIcon className="h-10 w-10 shrink-0 text-[#FF0000]" />
      <div className="pl-5">
        <p className="truncate text-sm font-medium text-gray-500">
          Subscribers
        </p>
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{data.stat}</p>
          <p
            className={`ml-2 flex items-baseline text-sm font-semibold ${
              data.changeType === "increase" ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.changeType === "increase" ? (
              <ArrowSmUpIcon className="h-5 w-5 shrink-0 self-center text-green-500" />
            ) : (
              <ArrowSmDownIcon className="h-5 w-5 shrink-0 self-center text-red-500" />
            )}
            {data.change}
          </p>
        </div>
      </div>
    </div>
  );
}

export { YouTubeStats };
