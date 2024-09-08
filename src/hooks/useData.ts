import { useAxios } from "./useAxios";
import { useQuery } from "@tanstack/react-query";

type useDataProps = {
  name: string;
  params: any;
  endpoint: any;
  refetchInterval?: any,
  enabled?:boolean
};

const useData = ({ params, name,endpoint,refetchInterval,enabled=true }: useDataProps) => {
  const api = useAxios();

  const { refetch, data, isLoading, isRefetching, isFetching } =  useQuery({
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
  enabled:enabled
  });

  return { refetch, data, isLoading, isRefetching, isFetching };
};

export default useData;