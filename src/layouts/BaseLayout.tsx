import {
  DoubleRightOutlined,
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  QuestionCircleFilled,
  SettingOutlined,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
import { css } from '@emotion/css';
import {
  Button,
  ConfigProvider,
  Dropdown,
} from 'antd';
import React, { useState } from 'react';
import defaultProps from './_defaultProps';
import { useNavigate, Outlet } from 'react-router';
import useAuth from "../hooks/useAuth"
import enUS from 'antd/lib/locale/en_US';
import useScreenSize from '../hooks/useScreenSize';
import frFR from 'antd/lib/locale/fr_FR';

export default () => {
  const {logout} = useAuth();
  const navigate = useNavigate();
  
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  // Toggles between dark and light themes
  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: "mix",
    splitMenus: false,
    navTheme: isDarkTheme ? 'realDark' : 'light',  // Make sure this uses the updated theme state
    contentWidth: "Fluid",
    colorPrimary: "#1677FF",
    siderMenuType: "group",
  });

  const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');
  const size = useScreenSize();

  if (typeof document === 'undefined') {
    return <div />;
  }

  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ConfigProvider
        componentSize={size}
        getTargetContainer={() => {
          return document.getElementById('test-pro-layout') || document.body;
        }}
        locale={frFR}
      >
        <ProConfigProvider hashed={false}>
          <ProLayout
            prefixCls="my-prefix"
            {...defaultProps}
            location={{ pathname }}
            token={{
              header: {
                colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
              },
            }}
            siderMenuType="group"
            menu={{
              collapsedShowGroupTitle: true,
            }}
              // This applies the theme to the ProLayout
            avatarProps={{
              src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
              size: 'small',
              title: 'Qī Nīnī',
              render: (props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'logout',
                          icon: <LogoutOutlined />,
                          label: 'Log Out',
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
              if (typeof window === 'undefined') return [];
              return [
                <InfoCircleFilled key="InfoCircleFilled" />,
                <QuestionCircleFilled key="QuestionCircleFilled" />,
                <GithubFilled key="GithubFilled" />,
                <Button
                  type="text"
                  icon={<SettingOutlined />}
                  onClick={toggleTheme}
                >
                  
                </Button>
              ];
            }}
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <a>
                  {logo}
                  {title}
                </a>
              );
              if (typeof window === 'undefined') return defaultDom;
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              if (_.isMobile) return defaultDom;
              return (
                <>
                  {defaultDom}
                </>
              );
            }}
            menuFooterRender={(props) => {
              if (props?.collapsed) return undefined;
              return (
                <div
                  style={{
                    textAlign: 'center',
                    paddingBlockStart: 12,
                  }}
                >
                  <div>© 2021 Made with love</div>
                  <div>by Ant Design</div>
                </div>
              );
            }}
            onMenuHeaderClick={(e) => console.log(e)}
            menuItemRender={(item, dom) => (
              <a
                onClick={() => {
                  setPathname(item.path || '/admin/dashboard');
                  navigate(item.path || '/admin/dashboard');
                }}
              >
                {dom}
              </a>
            )}
            {...settings}
          >
            <Outlet />
            <SettingDrawer
              pathname={pathname}
              enableDarkTheme
              getContainer={(e: any) => {
                if (typeof window === 'undefined') return e;
                return document.getElementById('test-pro-layout');
              }}
              settings={settings}
              onSettingChange={(changeSetting) => {
                setSetting(changeSetting);
              }}
              disableUrlParams={false}
            />
          </ProLayout>
        </ProConfigProvider>
      </ConfigProvider>
    </div>
  );
};
