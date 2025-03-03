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
import useBareme from "@/hooks/references/useBareme"
import useZone from "@/hooks/references/useZone";
import useParc from "@/hooks/references/useParc";
import useAgentDouane from "@/hooks/references/useAgentDouane";
import useDirection from "@/hooks/references/useDirection";

const ReferenceContext = createContext<any>(null);

type ReferenceContextProps = {
  children: React.ReactNode;
};

type Retuentype = {
  navire: any,
  regime: any,
  consignataire: any,
  armateur: any,
  port: any,
  mrn: any,
  client: any,
  transitaire: any,
  containerType: any,
  user: any,
  box: any,
  banque: any,
  rubrique: any,
  bareme: any,
  zone: any,
  parc: any,
  AgentDouane: any
  direction:any
}

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
  const bareme = useBareme();
  const zone = useZone();
  const parc = useParc();
  const AgentDouane = useAgentDouane();
  const direction = useDirection();

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
    rubrique,
    bareme,
    zone,
    parc,
    AgentDouane,
    direction
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
