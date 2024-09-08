import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_CONTAINER_TYPES_ENDPOINT } from "../../api/api";
import { Consignataire, ContainerType } from "../../types/reference";

interface UseResult {
  results: ContainerType[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useContainerType = (): UseResult => {
    const [results, setResults] = useState<ContainerType[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_CONTAINER_TYPES_ENDPOINT,
      name: "GET_CONTAINER_TYPE",
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

export default useContainerType;

