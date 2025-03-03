import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_DIRECTIONS_ENDPOINT, API_PORTS_ENDPOINT } from "../../api/api";
import { Direction, Port } from "../../types/reference";

interface UseResult {
  results: Direction[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useDirection = (): UseResult => {
    const [results, setResults] = useState<Direction[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_DIRECTIONS_ENDPOINT,
      name: "GET_DIRECTION",
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

export default useDirection;
