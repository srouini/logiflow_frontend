import { useEffect, useState } from 'react';

interface UseLoadingProps {
  isLoadingData: boolean;
  isRefetching: boolean;
}

const useLoading = ({ isLoadingData, isRefetching }: UseLoadingProps) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(isLoadingData);
  }, [isLoadingData]);

  useEffect(() => {
    setLoading(isRefetching);
  }, [isRefetching]);

  return { isLoading };
};

export default useLoading;
