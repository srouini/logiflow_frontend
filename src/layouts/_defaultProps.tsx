import {
  ChromeFilled,
  CrownFilled,
  SmileFilled,
  TabletFilled,
} from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/admin',
        name: 'Admin',
        children: [
          { path: '/admin/dashboard', name: 'Dashboard' },
          { path: '/admin/settings', name: 'Settings' },
        ],
      },
      {
        path: '/rotation',
        name: 'Rotations',
        children: [
          { path: '/rotations/mrns', name: 'Mrns' },
          { path: '/rotations/Articles/:id', name: 'Articles' },
          { path: '/rotations/containers/:id', name: 'Containers' },

          
        ],
      },
      {
        path: '/packages',
        name: 'Packages',
        children: [
          { path: '/packages/list', name: 'Package List' },
          { path: '/packages/details', name: 'Package Details' },
        ],
      },
      {
        path: '/orders',
        name: 'Orders',
        children: [
          { path: '/orders/list', name: 'Order List' },
          { path: '/orders/details', name: 'Order Details' },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
 
};