import { useEffect, useState } from "react";
import useData from "../useData";
import { API_BANQUES_ENDPOINT } from "../../api/api";
import { Banque } from "../../types/reference";
interface UseResult {
  results: Banque[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useBanque = (): UseResult => {
  const [results, setResults] = useState<Banque[]>();

  const { data, isLoading, isRefetching, refetch } = useData({
    endpoint: API_BANQUES_ENDPOINT,
    name: "GET_BANQUE",
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
    refetch,
  };
};

export default useBanque;
