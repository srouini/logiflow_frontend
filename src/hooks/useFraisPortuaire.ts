import useData from './useData';
import { API_PRESTATIONS_OCCASIONNELLE_ENDPOINT } from '@/api/api';

interface Props {
    article: string | undefined
}
const useFraisPortuaire = ({article}:Props) => {

    const {
        data,
        isLoading: isLoadingData,
        isRefetching,
        refetch,
      } = useData({
        endpoint: API_PRESTATIONS_OCCASIONNELLE_ENDPOINT,
        name: "GET_FRAIS_PORTUAIRES",
        params: {
          rubrique__icontains:"FRAIS PORTUAIRES",
          tc__article__in: article,
        },
      });

  return {data,
    isLoading: isLoadingData,
    isRefetching,
    refetch}
}

export default useFraisPortuaire