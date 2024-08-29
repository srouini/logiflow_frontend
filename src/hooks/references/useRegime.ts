import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_REGIMES_ENDPOINT } from "../../api/api";
import { Regime } from "../../types/bareme";

interface UseResult {
  results: Regime[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useRegime = (): UseResult => {
    const [results, setResults] = useState<Regime[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_REGIMES_ENDPOINT,
      name: "GET_REGIME",
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
      refetch 
    };
};

export default useRegime;
