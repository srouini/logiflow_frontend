import { useEffect, useState } from 'react';
import { AgentDouane } from '@/types/reference';
import { API_AGENT_DOUANE_ENDPOINT } from '@/constants/reference';
import useData from '../useData';



interface useAgentDouaneResult {
  results: AgentDouane[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  fetch: () => void;
  refetch: () => void;
}

const useAgentDouane = (): useAgentDouaneResult => {
    const [results, setResults] = useState<AgentDouane[]>();

    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: API_AGENT_DOUANE_ENDPOINT,
      name: "GET_AGNETS_DOUANE",
      enabled: false,
      params: { all: true, fields: "full_name,id" },
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

export default useAgentDouane;

