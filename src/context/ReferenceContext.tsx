import React, { createContext, useContext } from "react";
import useNavire from "../hooks/references/useNavire"
import useRegime from "../hooks/references/useRegime";
import useConsignataire from "../hooks/references/useConsignataire";
import useArmateur from "../hooks/references/useArmateur";
import usePort from "../hooks/references/usePort";
import useMrn from "@/hooks/references/useMrn";

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
 
  const contextValues = {
    navire,
    regime,
    consignataire,
    armateur,
    port,
    mrn
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
