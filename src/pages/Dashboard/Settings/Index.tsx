import { PageContainer } from "@ant-design/pro-components";
import { useEffect } from "react";
import Account from "./components/Account";
import useAuth from "@/hooks/useAuth";
import Profile from "./components/Profile";

export default () => {
const {account} = useAuth();
  useEffect(() => {
    account?.fetch();
  }, []);


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
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
      }}
    
      tabList={[
        {
          tab: "Compte",
          key: "1",
          children: <Account id={account?.id} />,
        },
        {
          tab: "Préférences",
          key: "2",
          children: <Profile  id={account?.id} />,
        },
      ]}
    ></PageContainer>
  );
};
