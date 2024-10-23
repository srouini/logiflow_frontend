import React, { createContext, useContext } from "react";
import useNavire from "../hooks/references/useNavire"
import useRegime from "../hooks/references/useRegime";
import useConsignataire from "../hooks/references/useConsignataire";
import useArmateur from "../hooks/references/useArmateur";
import usePort from "../hooks/references/usePort";
import useMrn from "@/hooks/references/useMrn";
import useClient from "@/hooks/references/useClient";
import useTransitaire from "@/hooks/references/useTransitaire";
import useContainerType from "@/hooks/references/useContainerType";
import useUser from "@/hooks/references/useUser";
import useBox from "@/hooks/references/useBox";
import useBanque from "@/hooks/references/useBanque";
import useRubrique from "@/hooks/references/useRubruique";

const ReferenceContext = createContext<any>(null);

type ReferenceContextProps = {
  children: React.ReactNode;
};

const ReferenceContextProvider = ({ children }: ReferenceContextProps) => {

  const navire = useNavire();
  const regime = useRegime();
  const consignataire = useConsignataire();
  const armateur = useArmateur();
  const port = usePort();
  const mrn = useMrn();
  const client = useClient();
  const transitaire = useTransitaire();
  const containerType = useContainerType();
  const user = useUser();
  const box = useBox();
  const banque = useBanque();
  const rubrique = useRubrique();
 
  const contextValues = {
    navire,
    regime,
    consignataire,
    armateur,
    port,
    mrn,
    client,
    transitaire,
    containerType,
    user, 
    box, 
    banque, 
    rubrique
  };

  return (
    <ReferenceContext.Provider value={contextValues}>
      {children}
    </ReferenceContext.Provider>
  );
};



export default ReferenceContextProvider;

export const useReferenceContext = () => {
  const Context = useContext(ReferenceContext);

  if (!Context) {
    throw new Error(
      "useReferenceContext must be used within a ReferenceContextProvider"
    );
  }
  return Context;
};
