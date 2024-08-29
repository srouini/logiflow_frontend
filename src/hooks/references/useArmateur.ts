import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_ARMATEURS_ENDPOINT } from "../../api/api";
import { Armateur } from "../../types/reference";

interface UseResult {
  results: Armateur[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useArmateur = (): UseResult => {
    const [results, setResults] = useState<Armateur[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_ARMATEURS_ENDPOINT,
      name: "GET_ARMATEUR",
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

export default useArmateur;
