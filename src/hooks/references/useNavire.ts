import { useEffect, useState } from "react";
import useData from "../useData";
import { Navire } from "../../types/reference";
import { API_NAVIRES_ENDPOINT } from "../../api/api";

interface UseNavireResult {
  results: Navire[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useNavire = (): UseNavireResult => {
    const [results, setResults] = useState<Navire[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_NAVIRES_ENDPOINT,
      name: "GET_NAVIRE",
      enabled: false,
      params: { all: true, fields: "id,nom" },
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

export default useNavire;
