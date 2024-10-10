import { useAxios } from "./useAxios";
import { useQuery } from "@tanstack/react-query";
import useLoading from "./useLoading";

type useDataProps = {
  name: string;
  params: any;
  endpoint: any;
  refetchInterval?: any,
  enabled?:boolean
};

const useData = ({ params, name,endpoint,refetchInterval,enabled=true }: useDataProps) => {
  const api = useAxios();

  const { refetch, data, isLoading:isLoadingData, isRefetching, isFetching } =  useQuery({
    queryKey: [name, params],
    queryFn: () => {
      try {
        return api.get(endpoint, {
          params: { ...params },
        });
      } catch (error) {
        console.log(error);
      }
    },
    ...(refetchInterval ? { refetchInterval } : {}),
  enabled:enabled,  // Don't refetch when component mounts
  refetchOnWindowFocus:true
  });

  const { isLoading:isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });


  return { refetch, data, isLoading, isRefetching, isFetching };
};

export default useData;