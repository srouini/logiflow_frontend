export type DataResult = any; // Replace `any` with a more specific type if available

export interface UseDataResult {
  refetch: () => Promise<any>;
  data: DataResult | null;
  isLoading: boolean;
  isRefetching: boolean;
}

export interface ReferenceContextProps {
  navire: UseDataResult;
  cosignataire: UseDataResult;
  armateur: UseDataResult;
  port: UseDataResult;
  gros: UseDataResult;
  client: UseDataResult;
  banque: UseDataResult;
  transitaire: UseDataResult;
  bareme: UseDataResult;
  regime: UseDataResult;
}