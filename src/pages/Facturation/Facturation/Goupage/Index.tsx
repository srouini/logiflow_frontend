import { PageContainer, ProCard } from "@ant-design/pro-components";
import useData from "@/hooks/useData";
import { API_SOUSARTICLES_ENDPOINT } from "@/api/api";
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

import { Divider, Flex } from "antd";
import UpdateVolume from "./components/UpdateVolume"
import UpdateBareme from "./components/UpdateBareme"
import UpdateTransitaire from "./components/UpdateTransitaire"

export default () => {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isRefetching,
    refetch
  } = useData({
    endpoint: API_SOUSARTICLES_ENDPOINT + id + "/",
    name: `GET_SELECTED_SUB_ARTICLE_${id}`,
    params: {
      expand: "transitaire,tc.article.gros,tc.article.client,client",
    },
  });



  const [tab, setTab] = useState("factures");
  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `SousArticle ${data?.data?.numero} / ${data?.data?.tc?.article?.numero}`,
        extra: [],
      }}
    >
      <Details
        dataSource={data?.data}
        isLoading={isLoading || isRefetching}
        DetailsColumns={DetailsColumns}
      />
      <Divider />
      <Flex style={{width:"100%"}} justify="end" gap={24}>
     
      <UpdateVolume refetch={refetch} sous_article={data?.data} />
        <UpdateBareme refetch={refetch} sous_article={data?.data}  />
        <UpdateTransitaire refetch={refetch} sous_article={data?.data}  />
    
      </Flex>
      <ProCard
        tabs={{
          tabPosition: "top",
          activeKey: tab,
          
          items: [
            {
              label: `Factures`,
              key: "factures",
              children: <Factures id={id} article={data?.data} activeTab={tab}/>,
            },
            {
              label: `Proformas`,
              key: "proformas",
              children: <Proformas id={id} article={data?.data} refetch_sub_article={refetch} />,
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
            // {
            //   label: `Facture Complementaire`,
            //   key: "facture_complementaire",
            //   children: <FactureComplementaire id={id} article={data?.data}/>,
            // }, 
            // {
            //   label: `Facture Avoire`,
            //   key: "facture_avoire",
            //   children: <FactureAvoire id={id} article={data?.data}/>,
            // },
          ],
          onChange: (key) => {
            setTab(key);
          },
        }}
      />
    </PageContainer>
  );
};
