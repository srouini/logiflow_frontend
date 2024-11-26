import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_PARCS_ENDPOINT  } from "../../api/api";
import { Parc } from "../../types/reference";

interface UseResult {
  results: Parc[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useParc = (): UseResult => {
    const [results, setResults] = useState<Parc[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_PARCS_ENDPOINT,
      name: "GET_PARC",
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

export default useParc;
