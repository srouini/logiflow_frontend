
export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/dashboard',
        name: 'Dashboard',
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
        path: '/billing',
        name: 'Facturation',
          children: [
          { path: '/facturation', name: 'Facturation' },
          { path: '/boncommande', name: 'Bon Commande' },
        ],
       
      },
      {
        path: '/visites',
        name: 'Visites',
        children: [
          { path: '/visites/ordinaire', name: 'Ordinaire' },
          { path: '/visites/groupage', name: 'Groupage' },
        ],
      },
      {
        path: '/documents',
        name: 'Documents',
        children: [
          { path: '/documents/factures', name: 'Factures' },
          { path: '/documents/Proformas', name: 'Proformas' },
          { path: '/documents/bonsorties', name: 'Bon Sortie' },
          { path: '/documents/boncommande', name: 'Bon Commande' },
        ],
      },
      {
        path: '/documentsgroupage',
        name: 'Documents Groupage',
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