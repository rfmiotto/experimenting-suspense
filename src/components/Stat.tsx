import { ElementType } from "react";
import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/solid";
import { useQuery } from "react-query";

import api from "../services/api";
import { Spinner } from "./Spinner";

type StatProps = {
  Icon: ElementType;
  label: string;
  endpoint: string;
};

function Stat({ Icon, label, endpoint }: StatProps) {
  const { isLoading, data } = useQuery<any, Error>(
    endpoint,
    async () => {
      const response = await api.get(endpoint);
      return response.data;
    },
    { suspense: false }
  );

  if (isLoading) {
    return (
      <div className="flex h-28 w-72 items-center justify-center rounded-lg bg-white shadow">
        <Spinner />;
      </div>
    );
  }

  return (
    <>
      <Icon className="h-10 w-10 shrink-0 text-[#1DA1F2]" />
      <div className="pl-5">
        <p className="truncate text-sm font-medium text-gray-500">{label}</p>
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
    </>
  );
}

export { Stat };
