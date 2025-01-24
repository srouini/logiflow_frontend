import { PageContainer } from "@ant-design/pro-components";
import Statistics from "./Statistics";
import TopGroupeursChart from '@/pages/Reports/TopGroupeursChart';
import TopClientsChart from '@/pages/Reports/TopClientsChart';


export default () => {
  const breadcrumb = {
    items: [
      {
        path: "",
        title: "Dashboard",
      },
    ],
  };

  return (
    <div>
      <PageContainer
        contentWidth="Fluid"
 
        title=""
      >
        <Statistics />
        <TopGroupeursChart />
        <TopClientsChart />
      </PageContainer>
    </div>
  );
};
