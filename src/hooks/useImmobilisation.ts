import useData from './useData';
import { API_PRESTATIONS_OCCASIONNELLE_ENDPOINT } from '@/api/api';

interface Props {
    article: string | undefined
}
const useImmobilisation = ({article}:Props) => {

    const {
        data,
        isLoading: isLoadingData,
        isRefetching,
        refetch,
      } = useData({
        endpoint: API_PRESTATIONS_OCCASIONNELLE_ENDPOINT,
        name: "GET_IMMOBILISATION",
        params: {
          rubrique__icontains:"IMMOBILISATION",
            tc__article__in: article,
        },
      });

  return {data,
    isLoading: isLoadingData,
    isRefetching,
    refetch}
}

export default useImmobilisation