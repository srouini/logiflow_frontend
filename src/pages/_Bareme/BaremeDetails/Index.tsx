import { useState } from "react";
import Prestation from "./components/Ordinaire/Prestation/index";
import PrestationArticle from "./components/Ordinaire/PrestationArticle/index";
import Sejour from "./components/Ordinaire/Sejour/index";
import SejourTcGroupage from "./components/Groupage/SejourTcGroupage/index";
import SejourSousArticleGroupage from "./components/Groupage/SejourSousArticleGroupage/index";
import Branchement from "./components/Ordinaire/Branchement/index";
import PrestationGroupage from "./components/Groupage/PrestationGroupage/index";
import PrestationVisiteGroupage from "./components/Groupage/PrestationVisiteGroupage/index";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { useNavigate, useParams } from "react-router";
import useData from "@/hooks/useData";
import { API_BAREMES_ENDPOINT } from "@/api/api";
import useLoading from "@/hooks/useLoading";




export default () => {
  const { id } = useParams();

  const [tab, setTab] = useState('Prestation');
  const navigate = useNavigate();


  const {
    data: bareme,
    isLoading:isLoadingBareme,
    isRefetching,
    isFetching
  } = useData({
    endpoint: API_BAREMES_ENDPOINT + id + "/",
    name: `GET_SELECTED_BAREMEd_${id}`,
    params: {
    },
  });

  const { isLoading } = useLoading({ loadingStates: [isLoadingBareme, isRefetching, isFetching] });


  return (
    <>
      <PageContainer
      loading={isLoading}
        contentWidth="Fluid"
        header={{
          title: `${bareme?.data?.designation}`,
          onBack: () => navigate("/bareme/")
        }}
        title=" "
      >
    


          <ProCard
        
            style={{ marginBottom: 20 }}
            tabs={{
              type: 'line',
              activeKey: tab,
              tabPosition:"left",
              items: [
                {
                  label: `Prestation`,
                  key: 'Prestation',
                  children: <Prestation bareme={bareme?.data} />,
                },
                {
                  label: `Prestation Article`,
                  key: 'PrestationArticle',
                  children: <PrestationArticle bareme={bareme?.data} />,
                },
                {
                  label: `Sejour`,
                  key: 'Sejour',
                  children: <Sejour bareme={bareme?.data} />,
                },
                {
                  label: `Branchement`,
                  key: 'Branchement',
                  children: <Branchement bareme={bareme?.data} />,
                },
                {
                  label: `Sejour Tc Groupage`,
                  key: 'SejourTcGroupage',
                  children: <SejourTcGroupage bareme={bareme?.data} />,
                },
                {
                  label: `Sejour SousArticle`,
                  key: 'SejourSousArticleGroupage',
                  children: <SejourSousArticleGroupage bareme={bareme?.data} />,
                },
                {
                  label: `Prestation Groupage`,
                  key: 'PrestationGroupage',
                  children: <PrestationGroupage bareme={bareme?.data} />,
                },
                {
                  label: `Visite Groupage`,
                  key: 'PrestationVisiteGroupage',
                  children: <PrestationVisiteGroupage bareme={bareme?.data} />,
                },
              ],
              onChange: (key) => {
                setTab(key);
              },
            }}
          />

      </PageContainer>
    </>
  );
};
