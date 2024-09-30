import { PageContainer, ProCard } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import {
  API_ARTICLES_ENDPOINT,
  API_FACTURES_AVOIRE_ENDPOINT,
  API_FACTURES_COMPLIMENTAIRE_ENDPOINT,
  API_PRESTATIONS_OCCASIONNELLE_ENDPOINT,
} from "@/api/api";
import { breadcrumb } from "./data";
import { useParams } from "react-router";
import Details from "@/components/Details";
import { DetailsColumns } from "./data";
import { useState } from "react";
import Factures from "./components/Factures/Index"
import Proformas from "./components/Proformas/Index"
import Commandes from "./components/Commandes/Index"
import Visites from "./components/Visites/Index"

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



  const {
    data: prestationsOccasionnelle,
    isLoading: isLoadingPrestationsOccasionnelle,
    refetch: refetchPrestationsOccasionnelle,
  } = useData({
    endpoint: API_PRESTATIONS_OCCASIONNELLE_ENDPOINT,
    name: `GET_PRESTATIONS_OCCASIONNELLE_${id}`,
    params: {
      expand: "type_tc,current_scelle",
      tc__article__id: id,
      all: true,
    },
  });

  const {
    data: facturesAvoires,
    isLoading: isLoadingFacturesAvoires,
    refetch: refetchFacturesAvoires,
  } = useData({
    endpoint: API_FACTURES_AVOIRE_ENDPOINT,
    name: `GET_FACTURES_AVOIRE_${id}`,
    params: {
      expand: "facture",
      facture__proforma__article__id: id,
      all: true,
    },
  });

  const {
    data: facturesComplimentaire,
    isLoading: isLoadingFacturesComplimentaire,
    refetch: refetchFacturesComplimentaire,
  } = useData({
    endpoint: API_FACTURES_COMPLIMENTAIRE_ENDPOINT,
    name: `GET_FACTURES_COMPLIMENTAIRE_${id}`,
    params: {
      expand: "facture",
      facture__proforma__article__id: id,
      all: true,
    },
  });

  const [tab, setTab] = useState('factures');
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
          tabPosition:"top",
          activeKey: tab,
          items: [
            {
              label: `Factures`,
              key: 'factures',
              children: <Factures id={id} />,
            },
            {
              label: `Proformas`,
              key: 'proformas',
              children: <Proformas id={id} />,
            },
            {
              label: `Visites`,
              key: 'visites',
              children: <Visites id={id}/>,
            },
            {
              label: `Commandes`,
              key: 'commandes',
              children: <Commandes id={id}/>,
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
