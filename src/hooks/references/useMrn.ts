import { Gros } from './../../types/data';
import { useEffect, useState } from "react";
import useData from "../useData";
import {  API_MRNS_ENDPOINT } from "../../api/api";

interface UseResult {
  results: Gros[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useMrn = (): UseResult => {
    const [results, setResults] = useState<Gros[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_MRNS_ENDPOINT,
      name: "GET_MRN_REF",
      enabled: false,
      params: { all: true, fields: "id,gros" },
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

export default useMrn;
