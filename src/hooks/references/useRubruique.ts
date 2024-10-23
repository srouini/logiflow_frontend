import { useEffect, useState } from "react";
import useData from "../useData";
import { API_RUBRIQUES_ENDPOINT } from "@/api/api";
import { Rubrique } from "@/types/bareme";

interface RubriqueResult {
  results: any;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useRubrique = (): RubriqueResult => {
    const [results, setResults] = useState<Rubrique[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_RUBRIQUES_ENDPOINT,
      name: "GET_RUBRIQUE",
      enabled: false,
      params: { all: true },
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

export default useRubrique;
