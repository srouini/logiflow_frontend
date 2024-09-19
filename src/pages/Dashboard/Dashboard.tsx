import { PageContainer } from "@ant-design/pro-components";

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
      ></PageContainer>
    </div>
  );
};
