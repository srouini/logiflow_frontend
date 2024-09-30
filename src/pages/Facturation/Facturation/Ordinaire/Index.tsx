import { PageContainer, ProCard } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import { API_ARTICLES_ENDPOINT } from "@/api/api";
import { breadcrumb } from "./data";
import { useParams } from "react-router";
import Details from "@/components/Details";
import { DetailsColumns } from "./data";
import { useState } from "react";
import Factures from "./components/Factures/Index";
import Proformas from "./components/Proformas/Index";
import Commandes from "./components/Commandes/Index";
import Visites from "./components/Visites/Index";
import PrestationsOccasionnelle from "./components/PrestationsOccasionelle/Index";
import FactureAvoire from "./components/FacturesAvoire/Index"
import FactureComplementaire from "./components/FacturesComplementaire/Index";

export default () => {
  const { id } = useParams();

  const {
    data: selectedArticleData,
    isLoading: isLoadingArticle,
    isRefetching: isRefetchingArticle,
    refetch: refetchSelectedArticle,
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
        title: `Article ${selectedArticleData?.data?.numero}`,
        extra: [],
      }}
    >
      <Details
        dataSource={selectedArticleData?.data}
        isLoading={isLoadingArticle || isRefetchingArticle}
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
              children: <Factures id={id} />,
            },
            {
              label: `Proformas`,
              key: "proformas",
              children: <Proformas id={id} />,
            },
            {
              label: `Visites`,
              key: "visites",
              children: <Visites id={id} />,
            },
            {
              label: `Commandes`,
              key: "commandes",
              children: <Commandes id={id} />,
            },
            {
              label: `Préstations occasionnelle`,
              key: "prestation_occasionnelle",
              children: <PrestationsOccasionnelle id={id} />,
            },
            {
              label: `Facture Complementaire`,
              key: "facture_complementaire",
              children: <FactureComplementaire id={id} />,
            },
            {
              label: `Facture Avoire`,
              key: "facture_avoire",
              children: <FactureAvoire id={id} />,
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
