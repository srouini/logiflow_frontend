import { PageContainer, ProCard } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import { API_ARTICLES_ENDPOINT } from "@/api/api";
import { breadcrumb } from "./data";
import { useParams } from "react-router";
import Details from "@/components/Details";
import { DetailsColumns } from "./data";
import { useState } from "react";
import Factures from "./Sections/Factures/Index";
import Proformas from "./Sections/Proformas/Index";
import Commandes from "./Sections/Commandes/Index";
import Visites from "./Sections/Visites/Index";
import PrestationsOccasionnelle from "./Sections/PrestationsOccasionelle/Index";
import FactureAvoire from "./Sections/FacturesAvoire/Index"
import FactureComplementaire from "./Sections/FacturesComplementaire/Index";

export default () => {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isRefetching,
  } = useData({
    endpoint: API_ARTICLES_ENDPOINT + id + "/",
    name: `GET_SELECTED_ARTICLE_${id}`,
    params: {
      expand: "client,transitairee,gros.regime",
    },
  });



  const [tab, setTab] = useState("factures");
  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `Article ${data?.data?.numero}`,
        extra: [],
      }}
    >
      <Details
        dataSource={data?.data}
        isLoading={isLoading || isRefetching}
        DetailsColumns={DetailsColumns}
      />
      <ProCard
        tabs={{
          tabPosition: "top",
          activeKey: tab,
          items: [
            {
              label: `Factures`,
              key: "factures",
              children: <Factures id={id} article={data?.data}/>,
            },
            {
              label: `Proformas`,
              key: "proformas",
              children: <Proformas id={id} article={data?.data}/>,
            },
            {
              label: `Visites`,
              key: "visites",
              children: <Visites id={id} article={data?.data}/>,
            },
            {
              label: `Commandes`,
              key: "commandes",
              children: <Commandes id={id} article={data?.data}/>,
            },
            {
              label: `Préstations occasionnelle`,
              key: "prestation_occasionnelle",
              children: <PrestationsOccasionnelle id={id} article={data?.data}/>,
            },
            {
              label: `Facture Complementaire`,
              key: "facture_complementaire",
              children: <FactureComplementaire id={id} article={data?.data}/>,
            }, 
            {
              label: `Facture Avoire`,
              key: "facture_avoire",
              children: <FactureAvoire id={id} article={data?.data}/>,
            },
          ],
          onChange: (key) => {
            setTab(key);
          },
        }}
      />
    </PageContainer>
  );
};
