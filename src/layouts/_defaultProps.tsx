import { BranchesOutlined, FieldTimeOutlined, FileDoneOutlined, FileProtectOutlined, SmileFilled, WindowsOutlined } from "@ant-design/icons";
import Title from "antd/es/skeleton/Title";

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        icon: <WindowsOutlined />,
        children: [
          { path: '/dashboard/dashboard', name: 'Dashboard'},
          { path: '/dashboard/settings', name: 'Settings' },
          { path: '/dashboard/references', name: 'References' },
        ],
      },

      {
        path: '/rotation',
        name: 'Rotations',
        icon:<BranchesOutlined />,
        children: [
          { path: '/rotations/mrns', name: 'Mrns' },
          { path: '/rotations/chargement', name: 'Chargement' },
          { path: '/rotations/reception', name: 'Reception' },
        ],
      },

      {
        path: '/billing',
        name: 'Facturation',
        icon:<FileProtectOutlined />,
          children: [
          { path: '/facturation', name: 'Facturation' },
          { path: '/boncommande', name: 'Bon Commande' },
        ],
       
      },
      {
        path: '/visites',
        name: 'Visites',
        icon:<FieldTimeOutlined />,
        children: [
          { path: '/visites/ordinaire', name: 'Ordinaire' },
          { path: '/visites/groupage', name: 'Groupage' },
        ],
      },
      {
        path: '/documents',
        name: 'Documents',
        icon:<FileDoneOutlined />,
        children: [
          { path: '/documents/factures', name: 'Factures' },
          { path: '/documents/Proformas', name: 'Proformas' },
          { path: '/documents/bonsorties', name: 'Bon Sortie' },
        ],
      },
      {
        path: '/documentsgroupage',
        name: 'Documents Groupage',
        icon:<FileDoneOutlined />,
        children: [
          { path: '/documentsgroupage/factures', name: 'Factures' },
          { path: '/documentsgroupage/Proformas', name: 'Proformas' },
          { path: '/documentsgroupage/bonsorties', name: 'Bon Sortie' },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
 
};