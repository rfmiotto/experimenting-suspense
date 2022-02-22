import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/solid";
import { useQuery } from "react-query";

import ChipotleIcon from "./icons/ChipotleIcon";
import api from "../services/api";
import { Spinner } from "./Spinner";

function ChipotleStats() {
  const { isLoading, isError, data, error } = useQuery<any, Error>(
    "chipotle",
    async () => {
      const response = await api.get("chipotle");
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
      <ChipotleIcon className="h-10 w-10 shrink-0" />
      <div className="pl-5">
        <p className="truncate text-sm font-medium text-gray-500">Burritos</p>
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

export { ChipotleStats };
