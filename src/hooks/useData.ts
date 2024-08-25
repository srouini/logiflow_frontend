import { useAxios } from "./useAxios";
import { useQuery } from "@tanstack/react-query";

type useDataProps = {
  name: string;
  params: any;
  endpoint: any;
  refetchInterval?: any
};

const useData = ({ params, name,endpoint,refetchInterval }: useDataProps) => {
  const api = useAxios();

  const { refetch, data, isLoading, isRefetching } = useQuery({
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
  });

  return { refetch, data, isLoading, isRefetching };
};

export default useData;