import { PageContainer } from '@ant-design/pro-components';

const Settings = () => {
  const breadcrumb = {
    items: [
      {
        path: "",
        title: "Dashboard",
      },
      {
        path: "",
        title: "Settings",
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
}

export default Settings