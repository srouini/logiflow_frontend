import { useEffect, useState } from "react";
import useData from "../useData";
import { Client } from "@/types/reference";
import { API_CLIENTS_ENDPOINT } from "@/api/api";

interface UseClientResult {
  results: Client[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useClient = (): UseClientResult => {
    const [results, setResults] = useState<Client[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_CLIENTS_ENDPOINT,
      name: "GET_CLIENT",
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

export default useClient;
