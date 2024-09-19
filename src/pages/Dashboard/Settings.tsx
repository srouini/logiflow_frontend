import { PageContainer } from '@ant-design/pro-components';
import React from 'react'

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