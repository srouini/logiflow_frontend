import { PageContainer } from "@ant-design/pro-components";
import Statistics from "./Statistics";
import ChartDemo from "./ChartDemo"
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
        header={{
          breadcrumb: breadcrumb,
        }}
        title=""
      >
        <Statistics />
        <ChartDemo />
      </PageContainer>
    </div>
  );
};
