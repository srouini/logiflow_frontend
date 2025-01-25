import { LogoutOutlined, MoonOutlined, SettingOutlined, SunOutlined, WindowsOutlined, BranchesOutlined, FileProtectOutlined, FieldTimeOutlined, FileDoneOutlined, CodepenOutlined, SlidersOutlined } from "@ant-design/icons";
import { MenuDataItem, ProConfigProvider, ProLayout } from "@ant-design/pro-components";
import { Col, ConfigProvider, Dropdown, message, Modal, Row, theme } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router";
import {useAuth} from "@/context/AuthContext";
import useScreenSize from "../hooks/useScreenSize";
import frFR from "antd/lib/locale/fr_FR";
import ReferenceContextProvider from "../context/ReferenceContext";
import { MenuProps } from "antd/lib";
import _defaultProps from "./_defaultProps";
import { Link } from "react-router-dom";
import avatar from "@/assets/avatar.png"


export default () => {

  const size = useScreenSize();

  const { user, logout, hasPagePermission, updateProfile } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize theme from user profile
  useEffect(() => {
    if (user?.profile?.theme_mode) {
      setIsDarkMode(user.profile.theme_mode === 'dark');
    }
  }, [user?.profile?.theme_mode]);

  const handleThemeChange = async () => {
    try {
      const newThemeMode = !isDarkMode;
      setIsDarkMode(newThemeMode); // Update UI immediately

      await updateProfile({
        theme_mode: newThemeMode ? 'dark' : 'light'
      });

      message.success('Theme updated successfully');
    } catch (error) {
      console.error('Failed to update theme:', error);
      setIsDarkMode(!isDarkMode); // Revert on error
      message.error('Failed to update theme');
    }
  };


  const generateMenuFromRoutes = () => {
    return [
      {
        path: '/',
        name: 'Dashboard',
        icon: <WindowsOutlined />,
      },
      {
        path: '/rotations',
        name: 'Rotations',
        icon: <BranchesOutlined />,
        children: [
          { path: '/rotations/mrns', name: 'Mrns' },
          { path: '/rotations/chargement', name: 'Chargement' },
          { path: '/rotations/reception', name: 'Reception' },
        ],
      },
      {
        path: '/conteneurs',
        name: 'Conteneurs',
        icon: <CodepenOutlined />,
      },
      {
        path: '/facturation',
        name: 'Facturation',
        icon: <FileProtectOutlined />,
        // children: [
        //   { path: '/facturation', name: 'Facturation' },
        // ],
      },
      {
        path: '/visites',
        name: 'Visites',
        icon: <FieldTimeOutlined />,
        children: [
          { path: '/visites/ordinaire', name: 'Ordinaire' },
          { path: '/visites/groupage', name: 'Groupage' },
        ],
      },
      {
        path: '/documents',
        name: 'Documents',
        icon: <FileDoneOutlined />,
        children: [
          { path: '/documents/factures', name: 'Factures' },
          { path: '/documents/proformas', name: 'Proformas' },
          { path: '/documents/bonsorties', name: 'Bons Sortie' },
          { path: '/documents/boncommande', name: 'Bon Commande' },

        ],
      },
      {
        path: '/documentsgroupage',
        name: 'Documents Groupage',
        icon: <FileDoneOutlined />,
        children: [
          { path: '/documentsgroupage/factures', name: 'Factures Groupage' },
          { path: '/documentsgroupage/proformas', name: 'Proformas Groupage' },
          { path: '/documentsgroupage/bonsorties', name: 'Bons Sortie Groupage' },
        ],
      },
      {
        path: '/bareme',
        name: 'Bareme',
        icon: <SlidersOutlined />,
      },
      {
        path:'/references',
        name: 'Reference',
        icon: <SlidersOutlined />,
        children: [
          { path: '/references/agent-douane', name: 'Agents Douane' },
        ],
      }
    ];
  };

  const filterMenuItems = (items: MenuDataItem[]): MenuDataItem[] => {
    return items
      .map((item) => {
        //@ts-ignore
        const hasPermission = hasPagePermission(item.path);

        // Recursively filter children
        const filteredChildren = item.children ? filterMenuItems(item.children) : undefined;

        // If the item has children, keep it if it has any authorized children
        if (filteredChildren && filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }

        // Keep the item if it has permission and no children
        if (hasPermission) {
          return { ...item, children: undefined }; // Remove children if they're empty
        }

        // Exclude the item otherwise
        return null;
      })
      .filter(Boolean) as MenuDataItem[]; // Remove null entries
  };
  

  const authorizedMenuItems = filterMenuItems(generateMenuFromRoutes());

  const handleLogout = async () => {
    const themeColor = user?.profile?.theme_color || '#968b6a';
    
    Modal.confirm({
      title: (
        <span style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
          Confirm Logout
        </span>
      ),
      content: (
        <span style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
          Are you sure you want to logout?
        </span>
      ),
      okText: 'Yes',
      cancelText: 'No',
      className: isDarkMode ? 'ant-modal-dark' : '',
      styles: {
        mask: {
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.25)'
        },
        content: {
          backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff'
        },
        footer: {
          borderTop: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
        },
        header: {
          borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
        }
      },
      icon: <LogoutOutlined style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />,
      okButtonProps: {
        style: {
          background: themeColor,
          borderColor: themeColor,
          color: '#ffffff'
        }
      },
      cancelButtonProps: {
        style: isDarkMode ? {
          background: 'transparent',
          borderColor: '#303030',
          color: '#ffffff'
        } : undefined
      },
      onOk: async () => {
        try {
          await logout();
          message.success('Logged out successfully');
        } catch (error) {
          message.error('Failed to logout');
        }
      }
    });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

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
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: user?.profile?.theme_color || '#3D9970',
          },
        }}
        locale={frFR}
      >
        <ProConfigProvider hashed={false}>
          <ProLayout
            prefixCls="my-prefix"
            fixedHeader
            layout={user?.profile?.layout_preference || 'top'}
            siderMenuType="sub"
            defaultCollapsed={false}
            //@ts-ignore
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <Row align="middle" justify="center" gutter={12}>
                  <Col style={{ display: "flex", alignItems: "center" }}>
                    <img src="/logo_white.png" width={80} alt="Logo" />
                  </Col>
                </Row>
              );
              if (typeof window === "undefined" || document.body.clientWidth < 1400 || _.isMobile) {
                return defaultDom;
              }
              return <>{defaultDom}</>;
            }}
      
            title=""
            logo="/logo_white.png"
            
            route={{
              path: '/',
              routes: authorizedMenuItems
            }}
            location={{
              pathname: location.pathname
            }}
            menu={{
              defaultOpenAll: true
            }}
            //@ts-ignore
            menuItemRender={(item, dom) => (
              <Link 
                to={item.path || '/'} 
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft:'12px',
             

                }}
              >
                {item.icon && <span className="anticon">{item.icon}</span>}
                <span>{item.name}</span>
              </Link>
            )}
            avatarProps={{
              src: <img src={avatar} />,
              title: user?.username,
              //@ts-ignore
              render: (props, dom) => (
                <Dropdown 
                  menu={{ items: userMenuItems }} 
                  placement="bottomRight"
                  trigger={['click']}
                >
                  {dom}
                </Dropdown>
              ),
            }}
            //@ts-ignore
            actionsRender={(props) => [
              isDarkMode ? <SunOutlined onClick={handleThemeChange} style={{ color: isDarkMode ? '#fff' : 'inherit' }} /> : <MoonOutlined onClick={handleThemeChange} style={{ color: isDarkMode ? '#fff' : 'inherit' }} />
            ]}
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
