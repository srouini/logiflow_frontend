
export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/admin',
        name: 'Admin',
        children: [
          { path: '/dashboard/dashboard', name: 'Dashboard' },
          { path: '/dashboard/settings', name: 'Settings' },
          { path: '/dashboard/references', name: 'References' },
        ],
      },

      {
        path: '/rotation',
        name: 'Rotations',
        children: [
          { path: '/rotations/mrns', name: 'Mrns' },
          { path: '/rotations/chargement', name: 'Chargement' },
          { path: '/rotations/reception', name: 'Reception' },
        ],
      },

      {
        path: '/facturation',
        name: 'Facturation',
        children: [
          { path: '/facturation/facturation', name: 'Facturation' },
          { path: '/facturation/visites', name: 'Visites' },
        ],
      },
      {
        path: '/documents',
        name: 'Documents',
        children: [
          { path: '/documents/factures', name: 'Factures' },
          { path: '/documents/Proformas', name: 'Proformas' },
          { path: '/documents/bonsorties', name: 'Bons Sortie' },
        ],
      },
      {
        path: '/documentsgroupage',
        name: 'Documents Groupage',
        children: [
          { path: '/documentsgroupage/factures', name: 'Factures' },
          { path: '/documentsgroupage/Proformas', name: 'Proformas' },
          { path: '/documentsgroupage/bonsorties', name: 'Bons Sortie' },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
 
};