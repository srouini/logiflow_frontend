import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_CONSIGNATAIRES_ENDPOINT } from "../../api/api";
import { Consignataire } from "../../types/reference";

interface UseResult {
  results: Consignataire[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useConsignataire = (): UseResult => {
    const [results, setResults] = useState<Consignataire[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_CONSIGNATAIRES_ENDPOINT,
      name: "GET_CONSIGNATAIRE",
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

export default useConsignataire;
