import { useEffect, useState } from "react";
import useData from "../useData";
import { API_BAREMES_ENDPOINT } from "../../api/api";
import { Bareme } from "../../types/bareme";

interface UseResult {
  results: Bareme[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useBareme = (): UseResult => {
  const [results, setResults] = useState<Bareme[]>();

  const { data, isLoading, isRefetching, refetch } = useData({
    endpoint: API_BAREMES_ENDPOINT,
    name: "GET_BARAMES",
    enabled: false,
    params: { all: true, fields: "id,designation" },
  });

  const fetch = () => {
    if (!results) {
      refetch();
    }
  };

  useEffect(() => {
    setResults(data?.data);
  }, [data]);

  return {
    results,
    isLoading,
    isRefetching,
    fetch,
    refetch,
  };
};

export default useBareme;
