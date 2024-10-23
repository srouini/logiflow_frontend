import { PageContainer } from "@ant-design/pro-components";
import Statistics from "./Statistics";
import { ArrowDownOutlined } from "@ant-design/icons";
import { Button } from "antd";
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
          onBack:() => console.log("")        }}
      >
<Statistics />

      </PageContainer>
    </div>
  );
};
