import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_BOXS_ENDPOINT  } from "../../api/api";
import { Box } from "../../types/reference";
interface UseResult {
  results: Box[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useBox = (): UseResult => {
    const [results, setResults] = useState<Box[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_BOXS_ENDPOINT,
      name: "GET_BOXS",
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

export default useBox;
