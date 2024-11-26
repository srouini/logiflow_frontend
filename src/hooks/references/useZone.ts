import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_ZONES_ENDPOINT  } from "../../api/api";
import { Zone } from "../../types/reference";

interface UseResult {
  results: Zone[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useZone = (): UseResult => {
    const [results, setResults] = useState<Zone[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_ZONES_ENDPOINT,
      name: "GET_ZONES",
      enabled: false,
      params: { all: true, fields: "id,zone" },
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

export default useZone;
