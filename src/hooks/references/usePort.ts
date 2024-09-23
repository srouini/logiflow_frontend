import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_PORTS_ENDPOINT } from "../../api/api";
import { Port } from "../../types/reference";

interface UseResult {
  results: Port[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const usePort = (): UseResult => {
    const [results, setResults] = useState<Port[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_PORTS_ENDPOINT,
      name: "GET_PORT",
      enabled: false,
      params: { all: true, fields: "id,raison_sociale" },
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

export default usePort;
