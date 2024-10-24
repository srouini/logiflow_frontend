import { useEffect, useState } from "react";
import useData from "../useData";
import { Navire } from "../../types/reference";

const useNavire = () => {
    const [navires, setNavires] = useState<Navire[]>();
  
    const { data, isLoading, isRefetching, refetch } = useData({
      endpoint: "/api/reference/navire/",
      name: "GET_NAVIRES",
      enabled: false,
      params: { all: true, fields:"id,nom" },
    });
  
    const fetchNavire = () => {
      if (!navires) {
        refetch();
      }
    };
  
    useEffect(() => {
      setNavires(data?.data);
    }, [data]);
  
    return { navires, isLoadingNavires:isLoading, isRefetchingNavires:isRefetching, fetchNavire, refetchNavires:refetch };
  };
  
  export default useNavire;