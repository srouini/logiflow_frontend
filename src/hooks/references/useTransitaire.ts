import { useEffect, useState } from "react";
import useData from "../useData";
import { Transitaire } from "@/types/reference";
import { API_TRANSITAIRE_ENDPOINT } from "@/api/api";

interface UseTransitaireResult {
  results: Transitaire[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useTransitaire = (): UseTransitaireResult => {
    const [results, setResults] = useState<Transitaire[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_TRANSITAIRE_ENDPOINT,
      name: "GET_TRANSITAIRE",
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

export default useTransitaire;
