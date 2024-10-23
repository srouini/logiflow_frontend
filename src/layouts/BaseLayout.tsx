import { LogoutOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import { ProConfigProvider, ProLayout } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Dropdown, Row } from "antd";
import { useEffect, useState } from "react";
import defaultProps from "./_defaultProps";
import { useNavigate, Outlet, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useScreenSize from "../hooks/useScreenSize";
import frFR from "antd/lib/locale/fr_FR";
import ReferenceContextProvider from "../context/ReferenceContext";

export default () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const {account} = useAuth();
  useEffect(() => {
    localStorage.getItem("theme")
      ? setCurrentTheme(localStorage.getItem("theme"))
      : setCurrentTheme("realDark");
  }, []);
  const [currentTheme, setCurrentTheme] = useState<any>("realDark");

  // Toggles between dark and light themes
  const toggleTheme = () => {
    if (currentTheme === "realDark") {
      setCurrentTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setCurrentTheme("realDark");
      localStorage.setItem("theme", "realDark");
    }

  };

  const [settings] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: "top",
    splitMenus: false,
    contentWidth: "Fluid",
    colorPrimary: "#FA541C",
    siderMenuType: "sub",
    fixedHeader: true,
  });

  const size = useScreenSize();

  if (typeof document === "undefined") {
    return <div />;
  }
  const location = useLocation();
  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ConfigProvider
        componentSize={size}
        getTargetContainer={() => {
          return document.getElementById("test-pro-layout") || document.body;
        }}
        locale={frFR}
      >
        <ProConfigProvider hashed={false}>
          <ProLayout
            prefixCls="my-prefix"
            {...defaultProps}
            location={{ pathname: location.pathname }}
            token={{
              header: {
                colorBgMenuItemSelected: "rgba(0,0,0,0.04)",
              },
            }}
            siderMenuType="group"
            menu={{
              collapsedShowGroupTitle: true,
            }}
            // This applies the theme to the ProLayout
            avatarProps={{
              src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
              size: "small",
              title: account?.full_name,
              shape:"square",
              // @ts-ignore
              render: (props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "logout",
                          icon: <LogoutOutlined />,
                          label: "Log Out",
                          onClick: () => logout(),
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                );
              },
            }}
            actionsRender={(props) => {
              if (props.isMobile) return [];
              if (typeof window === "undefined") return [];
              return [
                <Button
                  type="text"
                  icon={
                    currentTheme === "realDark" ? (
                      <SunOutlined />
                    ) : (
                      <MoonOutlined />
                    )
                  }
                  onClick={toggleTheme}
                ></Button>,
              ];
            }}
            // @ts-ignore
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <Row align={"middle"} justify={"center"} gutter={12}>
                  <Col style={{ display: "flex", alignItems: "center" }}>
                    <img src="/logo.ico" width={25} />
                  </Col>
                  <Col>
                    <span
                      style={{
                        fontSize: "10pt",
                        fontWeight: "bolder",
                        fontStyle: "italic",
                        opacity:"80%",
                        paddingRight:"40px"
                      }}
                    >
                      LOGIFLOW
                    </span>
                  </Col>
                </Row>
              );
              if (typeof window === "undefined") return defaultDom;
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              if (_.isMobile) return defaultDom;
              return <>{defaultDom}</>;
            }}
           
            menuItemRender={(item, dom) => (
              <a
                onClick={() => {
                  navigate(item.path || "/");
                }}
              >
                {dom}
              </a>
            )}
            {...settings}
            navTheme={currentTheme}
          >
            <ReferenceContextProvider>
              <Outlet />
            </ReferenceContextProvider>
          </ProLayout>
        </ProConfigProvider>
      </ConfigProvider>
    </div>
  );
};
